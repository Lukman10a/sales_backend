import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(userId: number): Promise<{
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
}
