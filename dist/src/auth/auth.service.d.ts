import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtPayload } from './types/jwt-payload';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    signup(dto: SignupDto, res: Response): Promise<{
        user: {
            displayName: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
            businessName: string | null;
            avatarUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            lastActive: Date | null;
            id: number;
            investorId: number | null;
        };
        accessToken: string;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        user: {
            displayName: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
            businessName: string | null;
            avatarUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            lastActive: Date | null;
            id: number;
            investorId: number | null;
        };
        accessToken: string;
    }>;
    refresh(payload: JwtPayload & {
        refreshToken: string;
    }, res: Response): Promise<{
        user: {
            displayName: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
            businessName: string | null;
            avatarUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            lastActive: Date | null;
            id: number;
            investorId: number | null;
        };
        accessToken: string;
    }>;
    logout(userId: number, res: Response): Promise<{
        success: boolean;
    }>;
    private issueTokensAndRespond;
    private signTokens;
    private setAuthCookies;
    private clearAuthCookies;
    private toPublicUser;
    private parseDuration;
}
