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
    refresh(user: JwtPayload & {
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
    logout(user: JwtPayload, res: Response): Promise<{
        success: boolean;
    }>;
}
