import { PrismaService } from '../prisma/prisma.service';
import type { User } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: number): Promise<User>;
    getProfileWithDisplayName(userId: number): Promise<{
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
    }>;
    updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<{
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
    }>;
    changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<{
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
    }>;
    private formatUserResponse;
}
