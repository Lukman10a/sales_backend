import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(userId: number): Promise<{
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
}
