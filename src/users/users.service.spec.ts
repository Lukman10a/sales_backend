import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from '@prisma/client';
import { UserRole } from '@prisma/client';
import * as argon2 from 'argon2';

jest.mock('argon2');

describe('UsersService', () => {
  let service: UsersService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    passwordHash: 'hashed-password',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.owner,
    businessName: 'Acme Corp',
    investorId: null,
    avatarUrl: 'https://example.com/avatar.png',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastActive: new Date(),
    refreshTokenHash: null,
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getProfile(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getProfileWithDisplayName', () => {
    it('should return user profile with displayName', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getProfileWithDisplayName(1);

      expect(result).toHaveProperty('displayName', 'John Doe');
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(result).toHaveProperty('firstName', 'John');
      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('refreshTokenHash');
    });
  });

  describe('updateProfile', () => {
    it('should update profile fields', async () => {
      const updatedUser = {
        ...mockUser,
        firstName: 'Jane',
        businessName: 'New Corp',
      };
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(1, {
        firstName: 'Jane',
        businessName: 'New Corp',
      });

      expect(result.displayName).toBe('Jane Doe');
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          firstName: 'Jane',
          businessName: 'New Corp',
        },
      });
    });

    it('should allow clearing businessName and avatarUrl', async () => {
      const clearedUser = {
        ...mockUser,
        businessName: null,
        avatarUrl: null,
      };
      mockPrismaService.user.update.mockResolvedValue(clearedUser);

      await service.updateProfile(1, {
        businessName: null,
        avatarUrl: null,
      });

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          businessName: null,
          avatarUrl: null,
        },
      });
    });
  });

  describe('changePassword', () => {
    it('should change password with valid current password', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      (argon2.hash as jest.Mock).mockResolvedValue('new-hashed-password');

      const updatedUser = {
        ...mockUser,
        passwordHash: 'new-hashed-password',
      };
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.changePassword(1, {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword456',
      });

      expect(result).not.toHaveProperty('passwordHash');
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { passwordHash: 'new-hashed-password' },
      });
    });

    it('should throw BadRequestException if current password is incorrect', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword(1, {
          currentPassword: 'WrongPassword',
          newPassword: 'NewPassword456',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.changePassword(1, {
          currentPassword: 'OldPassword123',
          newPassword: 'NewPassword456',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
