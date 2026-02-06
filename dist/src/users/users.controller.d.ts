import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(userId: number): Promise<{
        displayName: string;
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.UserRole;
        businessName: string | null;
        avatarUrl: string | null;
        investorId: number | null;
        createdAt: Date;
        updatedAt: Date;
        lastActive: Date | null;
    }>;
    updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<{
        displayName: string;
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.UserRole;
        businessName: string | null;
        avatarUrl: string | null;
        investorId: number | null;
        createdAt: Date;
        updatedAt: Date;
        lastActive: Date | null;
    }>;
    changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<{
        displayName: string;
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.UserRole;
        businessName: string | null;
        avatarUrl: string | null;
        investorId: number | null;
        createdAt: Date;
        updatedAt: Date;
        lastActive: Date | null;
    }>;
}
