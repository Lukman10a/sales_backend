import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from '@prisma/client';
import { UserRole } from '@prisma/client';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, any> = {
        JWT_ACCESS_SECRET: 'test-access-secret',
        JWT_REFRESH_SECRET: 'test-refresh-secret',
        JWT_ACCESS_EXPIRES_IN: '15m',
        JWT_REFRESH_EXPIRES_IN: '7d',
        REMEMBER_ME_DAYS: 14,
        NODE_ENV: 'test',
      };
      return config[key];
    }),
  };

  const mockResponse: any = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should throw ConflictException if email exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'existing@test.com',
      });

      await expect(
        service.signup(
          {
            email: 'existing@test.com',
            password: 'Password123',
            firstName: 'Test',
            lastName: 'User',
            role: UserRole.owner,
          },
          mockResponse,
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('should create user and return tokens', async () => {
      const newUser: User = {
        id: 1,
        email: 'new@test.com',
        passwordHash: 'hashed',
        firstName: 'New',
        lastName: 'User',
        role: UserRole.owner,
        businessName: null,
        investorId: null,
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActive: new Date(),
        refreshTokenHash: null,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(newUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...newUser,
        refreshTokenHash: 'hashed-refresh',
      });
      mockJwtService.sign.mockReturnValue('mock-token');

      const result = await service.signup(
        {
          email: 'new@test.com',
          password: 'Password123',
          firstName: 'New',
          lastName: 'User',
          role: UserRole.owner,
        },
        mockResponse,
      );

      expect(result.user.email).toBe('new@test.com');
      expect(result.user.displayName).toBe('New User');
      expect(result).toHaveProperty('accessToken');
      expect(mockResponse.cookie).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login(
          { email: 'nonexistent@test.com', password: 'Password123' },
          mockResponse,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        passwordHash: await argon2.hash('CorrectPassword'),
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.owner,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      await expect(
        service.login(
          { email: 'test@test.com', password: 'WrongPassword' },
          mockResponse,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException if role does not match', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        passwordHash: await argon2.hash('Password123'),
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.owner,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      await expect(
        service.login(
          {
            email: 'test@test.com',
            password: 'Password123',
            role: UserRole.investor,
          },
          mockResponse,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('logout', () => {
    it('should clear cookies and refresh token hash', async () => {
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.logout(1, mockResponse);

      expect(result).toEqual({ success: true });
      expect(mockResponse.clearCookie).toHaveBeenCalledTimes(2);
    });
  });
});
