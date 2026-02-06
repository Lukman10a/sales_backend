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
    }>;
    updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<{
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
    }>;
    changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<{
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
    }>;
    private formatUserResponse;
}
