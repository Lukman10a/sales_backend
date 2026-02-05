import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AUTH_STRATEGY_REFRESH, REFRESH_TOKEN_COOKIE } from '../auth.constants';
import { JwtPayload } from '../types/jwt-payload';

function cookieExtractor(cookieName: string) {
  return (req: any): string | null => {
    if (req?.cookies && req.cookies[cookieName]) {
      return req.cookies[cookieName];
    }
    return null;
  };
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGY_REFRESH,
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor(REFRESH_TOKEN_COOKIE),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    payload: JwtPayload,
  ): JwtPayload & { refreshToken: string } {
    const refreshToken =
      (req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined) ?? '';
    return { ...payload, refreshToken };
  }
}
