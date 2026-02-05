"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
exports.validateEnv = validateEnv;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(['development', 'test', 'production'])
        .default('development'),
    PORT: zod_1.z.coerce.number().int().min(1).max(65535).default(3000),
    DATABASE_URL: zod_1.z
        .string()
        .url()
        .default('postgresql://postgres:postgres@localhost:5432/primestock?schema=public'),
    FRONTEND_ORIGIN: zod_1.z.string().url().default('http://localhost:3001'),
    JWT_ACCESS_SECRET: zod_1.z.string().min(16).default('dev-access-secret'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(16).default('dev-refresh-secret'),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('7d'),
    RATE_LIMIT_MAX: zod_1.z.coerce.number().int().default(100),
    RATE_LIMIT_WINDOW_MS: zod_1.z.coerce.number().int().default(60_000),
    REMEMBER_ME_DAYS: zod_1.z.coerce.number().int().positive().default(14),
});
function validateEnv(config) {
    return exports.envSchema.parse(config);
}
//# sourceMappingURL=env.validation.js.map