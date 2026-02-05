import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Users (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.use(cookieParser());

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Clean up test user if exists
    await prisma.user.deleteMany({ where: { email: 'user@primestock.com' } });

    // Create and login test user
    const signupResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'user@primestock.com',
        password: 'TestPass123',
        firstName: 'Test',
        lastName: 'User',
        role: 'owner',
      });

    accessToken = signupResponse.body.accessToken;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'user@primestock.com' } });
    await app.close();
  });

  describe('GET /users/me', () => {
    it('should return current user profile with displayName', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('displayName');
      expect(response.body.displayName).toBe('Test User');
      expect(response.body).toHaveProperty('firstName');
      expect(response.body).toHaveProperty('lastName');
      expect(response.body).not.toHaveProperty('passwordHash');
      expect(response.body).not.toHaveProperty('refreshTokenHash');
    });

    it('should reject request without authentication', async () => {
      await request(app.getHttpServer()).get('/users/me').expect(401);
    });
  });

  describe('PATCH /users/me', () => {
    it('should update user profile', async () => {
      const response = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          firstName: 'Updated',
          lastName: 'Name',
          businessName: 'My Business',
          avatarUrl: 'https://example.com/avatar.jpg',
        })
        .expect(200);

      expect(response.body.firstName).toBe('Updated');
      expect(response.body.lastName).toBe('Name');
      expect(response.body.businessName).toBe('My Business');
      expect(response.body.avatarUrl).toBe('https://example.com/avatar.jpg');
      expect(response.body.displayName).toBe('Updated Name');
    });

    it('should allow partial profile updates', async () => {
      const response = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          firstName: 'PartialUpdate',
        })
        .expect(200);

      expect(response.body.firstName).toBe('PartialUpdate');
      expect(response.body.lastName).toBe('Name');
    });

    it('should allow clearing businessName', async () => {
      const response = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          businessName: null,
        })
        .expect(200);

      expect(response.body.businessName).toBeNull();
    });

    it('should reject invalid email format in avatarUrl', async () => {
      await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          avatarUrl: 'not-a-url',
        })
        .expect(400);
    });

    it('should reject request without authentication', async () => {
      await request(app.getHttpServer())
        .patch('/users/me')
        .send({
          firstName: 'Hacker',
        })
        .expect(401);
    });
  });

  describe('PATCH /users/me/password', () => {
    it('should change password with valid current password', async () => {
      // First update with known password
      await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          firstName: 'Password',
          lastName: 'Test',
        })
        .expect(200);

      const response = await request(app.getHttpServer())
        .patch('/users/me/password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'TestPass123',
          newPassword: 'NewPass456',
        })
        .expect(200);

      expect(response.body).not.toHaveProperty('passwordHash');
      expect(response.body.email).toBe('user@primestock.com');
    });

    it('should reject password change with wrong current password', async () => {
      await request(app.getHttpServer())
        .patch('/users/me/password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'WrongPassword123',
          newPassword: 'AnotherPass789',
        })
        .expect(400);
    });

    it('should reject weak new password', async () => {
      await request(app.getHttpServer())
        .patch('/users/me/password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'NewPass456',
          newPassword: 'weak',
        })
        .expect(400);
    });

    it('should reject request without authentication', async () => {
      await request(app.getHttpServer())
        .patch('/users/me/password')
        .send({
          currentPassword: 'TestPass123',
          newPassword: 'NewPass456',
        })
        .expect(401);
    });
  });
});
