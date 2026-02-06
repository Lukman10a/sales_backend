import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import type { JwtPayload } from './types/jwt-payload';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    refresh(user: JwtPayload & {
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
    logout(user: JwtPayload, res: Response): Promise<{
        success: boolean;
    }>;
}
