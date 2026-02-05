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
            role: import("@prisma/client").$Enums.UserRole;
            email: string;
            firstName: string;
            lastName: string;
            businessName: string | null;
            investorId: number | null;
            avatarUrl: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            lastActive: Date | null;
        };
        accessToken: string;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        user: {
            displayName: string;
            role: import("@prisma/client").$Enums.UserRole;
            email: string;
            firstName: string;
            lastName: string;
            businessName: string | null;
            investorId: number | null;
            avatarUrl: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            lastActive: Date | null;
        };
        accessToken: string;
    }>;
    refresh(payload: JwtPayload & {
        refreshToken: string;
    }, res: Response): Promise<{
        user: {
            displayName: string;
            role: import("@prisma/client").$Enums.UserRole;
            email: string;
            firstName: string;
            lastName: string;
            businessName: string | null;
            investorId: number | null;
            avatarUrl: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            lastActive: Date | null;
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
