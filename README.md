## Primestock Sales API

NestJS 11 backend for the Primestock sales management app. Tech: TypeScript, Prisma (PostgreSQL), Swagger (later phase), Jest tests, Docker.

### Quick start (local)

- Install deps: `npm install`
- Start Postgres locally or via docker-compose (see below).
- Generate Prisma client: `npm run prisma:generate`
- Run dev server: `npm run start:dev`
- Run tests: `npm test` (unit), `npm run test:e2e`

### Docker (dev convenience)

- Build and run API + Postgres: `docker compose up --build`
- API listens on port 3000; Postgres on 5432. Override env in .env (copy from .env.example).

### Environment

Copy .env.example to .env and adjust:

- NODE_ENV, PORT
- DATABASE_URL (e.g., postgresql://postgres:postgres@localhost:5432/primestock?schema=public)
- FRONTEND_ORIGIN (e.g., http://localhost:3001)
- JWT secrets and expirations
- Rate-limit and remember-me durations

### Scripts

- prisma:generate | prisma:migrate | prisma:deploy | prisma:studio | prisma:seed
- start | start:dev | start:prod
- test | test:e2e | lint | format

### Current scope (Phase 1-2)

- Global ConfigModule with Zod env validation.
- Prisma schema covering users, inventory, sales, reports, notifications, dashboard prefs, team, investors, withdrawals, backups.
- Dockerfile and docker-compose with Postgres.
- Auth module: signup/login/refresh/logout with JWT access/refresh in httpOnly cookies, argon2 password hashing, role-based guards, remember-me support, rate limiting.

Upcoming phases will add domain modules (users/inventory/sales/etc.), Swagger docs, and seed data.
