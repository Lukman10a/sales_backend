# Primestock Sales API - Memory Bank

## Goal

- Build NestJS backend for Primestock sales management with TypeScript, Nest 10+, Swagger docs, Jest tests, Prisma (PostgreSQL) ORM, and Docker support.

## Phase roadmap

Status legend: Planned (not started), In Progress, Done.

1. Foundations & tooling (ConfigModule with env schema, Prisma init, docker-compose with Postgres, npm scripts) — Done.
2. Auth & security core (signup/login/logout, JWT access/refresh in httpOnly cookies, role guard, remember-me, rate limiting) — Done.
3. Users & roles (profile CRUD, avatarUrl, businessName, investorId, role enforcement, password change) — Done.
4. Inventory & sales (Product CRUD with stock thresholds; SaleOrder with items, totals, statuses) — Done.
5. Reports & backups (scheduled/on-demand reports with mock downloadUrl, backups/export mock endpoints) — Done.
6. Notifications & dashboard prefs (notification preferences/templates stubs; dashboard layout/preferences/quick actions) — Planned.
7. Team & investors domain (team members with roles/permissions/status/activity log; investors, withdrawals, investor insights stubs) — Planned.
8. Docs, tests, and polish (Swagger with bearer auth, seeds, unit/e2e tests coverage sweep, config hardening, DX tweaks) — Planned.

## Decisions

- Password hashing: argon2 preferred (can switch to bcrypt if requested).
- Token transport: httpOnly cookies for access/refresh tokens; Authorization header support can be added if needed.

## Progress log

- 2026-01-25: Created memory bank and drafted phase roadmap.
- 2026-01-25: Phase 1 groundwork — added global ConfigModule with Zod env validation, Prisma schema + client wiring, Dockerfile and docker-compose for API + Postgres, initial scripts and .env.example.
- 2026-01-25: Phase 1 completed — resolved @nestjs/config peer conflict (bumped to v4), installed dependencies, ran prisma:generate successfully.
- 2026-01-25: Phase 2 work — added auth module (signup/login/refresh/logout), JWT access/refresh with httpOnly cookies, role guard/decorator, rate limiting via ThrottlerModule, argon2 password hashing, cookie parsing, validation pipe, and Prisma refresh token hash field.
- 2026-01-25: Phase 2 completed — added comprehensive e2e tests (auth.e2e-spec.ts) and unit tests (auth.service.spec.ts) for all auth flows; all tests passing.
- 2026-01-25: Phase 3 groundwork — created users module (get profile, update profile, change password), DTOs with validation, unit tests (users.service.spec.ts) and e2e tests (users.e2e-spec.ts); all unit tests passing, build clean.
- 2026-01-25: Phase 3 completed — all user endpoints and tests verified; 16 total tests passing (app, auth, users).
- 2026-01-25: Phase 4 groundwork — created products module with CRUD endpoints (create, list, update, remove), stock management (reduceStock, increaseStock, getLowStockProducts), and sale-orders module with complete order lifecycle (create with items, list, find, update status, update items, cancel, date range queries). Added DTOs and all business logic for inventory and sales operations.
- 2026-01-25: Phase 4 completed — Products and SaleOrders modules fully implemented with stock tracking, order management, and detailed items support. Build passing, all tests passing, lint clean.
- 2026-01-25: Phase 5 groundwork — created reports module (generate sales/inventory/performance reports, list, download, delete with role guards) and backups module (create, list, download, restore, schedule, settings with mock SQL content). Added unit tests for both services (13 tests total, all passing).
- 2026-01-25: Phase 5 completed — Reports and Backups modules fully implemented with role-based access control, mock file downloads, and complete lifecycle operations. Total: 33 tests passing (app, auth, users, reports, backups), build passing, lint clean.
