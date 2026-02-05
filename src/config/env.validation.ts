import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z
    .string()
    .url()
    .default(
      'postgresql://postgres:postgres@localhost:5432/primestock?schema=public',
    ),
  FRONTEND_ORIGIN: z.string().url().default('http://localhost:3001'),
  JWT_ACCESS_SECRET: z.string().min(16).default('dev-access-secret'),
  JWT_REFRESH_SECRET: z.string().min(16).default('dev-refresh-secret'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  RATE_LIMIT_MAX: z.coerce.number().int().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().default(60_000),
  REMEMBER_ME_DAYS: z.coerce.number().int().positive().default(14),
});

export type EnvSchema = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvSchema {
  return envSchema.parse(config);
}
