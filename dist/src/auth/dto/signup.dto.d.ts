import { UserRole } from '@prisma/client';
export declare class SignupDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    businessName?: string;
    investorId?: number;
    avatarUrl?: string;
    rememberMe?: boolean;
}
