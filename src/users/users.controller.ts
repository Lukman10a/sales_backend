import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /users/me
   * Get current user profile
   */
  @Get('me')
  async getProfile(@CurrentUser('sub') userId: number) {
    return this.usersService.getProfileWithDisplayName(userId);
  }

  /**
   * PATCH /users/me
   * Update current user profile
   */
  @Patch('me')
  async updateProfile(
    @CurrentUser('sub') userId: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

  /**
   * PATCH /users/me/password
   * Change current user password
   */
  @Patch('me/password')
  async changePassword(
    @CurrentUser('sub') userId: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(userId, changePasswordDto);
  }
}
