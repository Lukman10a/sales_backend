import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from './auth.constants';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtPayload } from './types/jwt-payload';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(dto: SignupDto, res: Response) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
        businessName: dto.businessName,
        investorId: dto.investorId,
        avatarUrl: dto.avatarUrl,
        lastActive: new Date(),
      },
    });

    return this.issueTokensAndRespond(user, res, dto.rememberMe === true);
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await argon2.verify(
      user.passwordHash,
      dto.password,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (dto.role && dto.role !== user.role) {
      throw new ForbiddenException('Role does not match this account');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() },
    });

    return this.issueTokensAndRespond(user, res, dto.rememberMe === true);
  }

  async refresh(payload: JwtPayload & { refreshToken: string }, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const valid =
      payload.refreshToken &&
      (await argon2.verify(user.refreshTokenHash, payload.refreshToken));
    if (!valid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.issueTokensAndRespond(user, res, false);
  }

  async logout(userId: number, res: Response) {
    await this.prisma.user
      .update({ where: { id: userId }, data: { refreshTokenHash: null } })
      .catch(() => undefined);

    this.clearAuthCookies(res);
    return { success: true };
  }

  private async issueTokensAndRespond(
    user: User,
    res: Response,
    rememberMe: boolean,
  ) {
    const tokens = this.signTokens(user, rememberMe);
    const refreshHash = await argon2.hash(tokens.refreshToken);

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: refreshHash, lastActive: new Date() },
    });

    this.setAuthCookies(res, tokens, rememberMe);

    return {
      user: this.toPublicUser(updatedUser),
      accessToken: tokens.accessToken,
    };
  }

  private signTokens(user: User, rememberMe: boolean): AuthTokens {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessExpiresIn =
      this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m';
    const refreshExpiresBase =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';
    const rememberDays =
      this.configService.get<number>('REMEMBER_ME_DAYS') ?? 14;
    const refreshExpiresIn = rememberMe
      ? `${rememberDays}d`
      : refreshExpiresBase;

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessExpiresIn as `${number}${'s' | 'm' | 'h' | 'd'}`,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: refreshExpiresIn as `${number}${'s' | 'm' | 'h' | 'd'}`,
    });

    return { accessToken, refreshToken };
  }

  private setAuthCookies(
    res: Response,
    tokens: AuthTokens,
    rememberMe: boolean,
  ) {
    const secure = this.configService.get<string>('NODE_ENV') === 'production';
    const accessMaxAge = this.parseDuration(
      this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m',
      15 * 60 * 1000,
    );

    const rememberDays =
      this.configService.get<number>('REMEMBER_ME_DAYS') ?? 14;
    const refreshValue = rememberMe
      ? `${rememberDays}d`
      : (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d');

    const refreshMaxAge = this.parseDuration(
      refreshValue,
      7 * 24 * 60 * 60 * 1000,
    );

    res.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/',
      maxAge: accessMaxAge,
    });

    res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/',
      maxAge: refreshMaxAge,
    });
  }

  private clearAuthCookies(res: Response) {
    const secure = this.configService.get<string>('NODE_ENV') === 'production';
    res.clearCookie(ACCESS_TOKEN_COOKIE, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/',
    });
    res.clearCookie(REFRESH_TOKEN_COOKIE, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/',
    });
  }

  private toPublicUser(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, refreshTokenHash, ...rest } = user;
    return {
      ...rest,
      displayName: `${user.firstName} ${user.lastName}`.trim(),
    };
  }

  private parseDuration(value: string, fallbackMs: number): number {
    const match = /^([0-9]+)([smhd])$/.exec(value.trim());
    if (!match) {
      return fallbackMs;
    }

    const amount = Number(match[1]);
    const unit = match[2];
    const msByUnit: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return amount * msByUnit[unit] || fallbackMs;
  }
}
