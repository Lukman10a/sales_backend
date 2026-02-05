import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get user profile by ID
   */
  async getProfile(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Get user profile with displayName computed
   */
  async getProfileWithDisplayName(userId: number) {
    const user = await this.getProfile(userId);
    return this.formatUserResponse(user);
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(updateProfileDto.firstName && {
          firstName: updateProfileDto.firstName,
        }),
        ...(updateProfileDto.lastName && {
          lastName: updateProfileDto.lastName,
        }),
        ...(updateProfileDto.businessName !== undefined && {
          businessName: updateProfileDto.businessName,
        }),
        ...(updateProfileDto.avatarUrl !== undefined && {
          avatarUrl: updateProfileDto.avatarUrl,
        }),
      },
    });

    return this.formatUserResponse(user);
  }

  /**
   * Change user password
   */
  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      changePasswordDto.currentPassword,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await argon2.hash(changePasswordDto.newPassword);

    // Update password
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    return this.formatUserResponse(updatedUser);
  }

  /**
   * Format user response with displayName field
   */
  private formatUserResponse(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, refreshTokenHash, ...userWithoutSensitiveData } =
      user;
    return {
      ...userWithoutSensitiveData,
      displayName: `${user.firstName} ${user.lastName}`,
    };
  }
}
