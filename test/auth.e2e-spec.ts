import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '../src/auth/auth.constants';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

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
    await prisma.user.deleteMany({ where: { email: 'test@primestock.com' } });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'test@primestock.com' } });
    await app.close();
  });

  describe('POST /auth/signup', () => {
    it('should create a new user and return tokens', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'test@primestock.com',
          password: 'StrongPass123',
          firstName: 'Test',
          lastName: 'User',
          role: 'owner',
        })
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@primestock.com');
      expect(response.body.user.displayName).toBe('Test User');
      expect(response.body.user).not.toHaveProperty('passwordHash');
      expect(response.body).toHaveProperty('accessToken');

      const cookies = (response.headers['set-cookie'] ??
        []) as unknown as string[];
      expect(cookies).toBeDefined();
      expect(
        cookies.some((c: string) => c.startsWith(ACCESS_TOKEN_COOKIE)),
      ).toBe(true);
      expect(
        cookies.some((c: string) => c.startsWith(REFRESH_TOKEN_COOKIE)),
      ).toBe(true);
    });

    it('should reject duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'test@primestock.com',
          password: 'AnotherPass456',
          firstName: 'Duplicate',
          lastName: 'User',
          role: 'apprentice',
        })
        .expect(409);
    });

    it('should reject invalid email', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'not-an-email',
          password: 'Password123',
          firstName: 'Bad',
          lastName: 'Email',
          role: 'owner',
        })
        .expect(400);
    });

    it('should reject weak password', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'new@primestock.com',
          password: 'short',
          firstName: 'Weak',
          lastName: 'Pass',
          role: 'owner',
        })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login existing user and return tokens', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@primestock.com',
          password: 'StrongPass123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@primestock.com');
      expect(response.body).toHaveProperty('accessToken');

      const cookies = (response.headers['set-cookie'] ??
        []) as unknown as string[];
      expect(cookies).toBeDefined();
      expect(
        cookies.some((c: string) => c.startsWith(ACCESS_TOKEN_COOKIE)),
      ).toBe(true);
      expect(
        cookies.some((c: string) => c.startsWith(REFRESH_TOKEN_COOKIE)),
      ).toBe(true);
    });

    it('should reject wrong password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@primestock.com',
          password: 'WrongPassword999',
        })
        .expect(401);
    });

    it('should reject non-existent email', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@primestock.com',
          password: 'AnyPassword123',
        })
        .expect(401);
    });

    it('should reject when role does not match', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@primestock.com',
          password: 'StrongPass123',
          role: 'investor',
        })
        .expect(403);
    });

    it('should accept when role matches', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@primestock.com',
          password: 'StrongPass123',
          role: 'owner',
        })
        .expect(201);

      expect(response.body.user.role).toBe('owner');
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@primestock.com',
          password: 'StrongPass123',
        })
        .expect(201);

      const cookies = (loginResponse.headers['set-cookie'] ??
        []) as unknown as string[];
      const refreshCookie = cookies.find((c: string) =>
        c.startsWith(REFRESH_TOKEN_COOKIE),
      );

      const refreshResponse = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', refreshCookie ?? '')
        .expect(201);

      expect(refreshResponse.body).toHaveProperty('user');
      expect(refreshResponse.body).toHaveProperty('accessToken');

      const newCookies = (refreshResponse.headers['set-cookie'] ??
        []) as unknown as string[];
      expect(
        newCookies.some((c: string) => c.startsWith(ACCESS_TOKEN_COOKIE)),
      ).toBe(true);
      expect(
        newCookies.some((c: string) => c.startsWith(REFRESH_TOKEN_COOKIE)),
      ).toBe(true);
    });

    it('should reject refresh without token', async () => {
      await request(app.getHttpServer()).post('/auth/refresh').expect(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout and clear cookies', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@primestock.com',
          password: 'StrongPass123',
        })
        .expect(201);

      const cookies = (loginResponse.headers['set-cookie'] ??
        []) as unknown as string[];
      const refreshCookie = cookies.find((c: string) =>
        c.startsWith(REFRESH_TOKEN_COOKIE),
      );

      const logoutResponse = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', refreshCookie ?? '')
        .expect(201);

      expect(logoutResponse.body).toEqual({ success: true });

      const clearedCookies = logoutResponse.headers['set-cookie'];
      expect(clearedCookies).toBeDefined();
    });

    it('should reject logout without token', async () => {
      await request(app.getHttpServer()).post('/auth/logout').expect(401);
    });
  });
});
