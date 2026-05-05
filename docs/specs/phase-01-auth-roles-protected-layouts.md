# Phase 01 — Auth, Roles, and Protected Layouts

## Goal

Implement secure authentication and role-based access foundations for Plus.

Phase 1 must allow a seeded Super Admin to log in, enforce account status rules, force first-login password setup when required, protect dashboard routes server-side, and redirect authenticated users to the dashboard matching their role.

## Current State

Phase 0 is complete:

- Next.js App Router project exists.
- TypeScript, Tailwind CSS, ESLint, Prisma 7, and npm scripts exist.
- `app/` has public `/` and `/docs` routes.
- `components/layout/app-shell.tsx`, `components/ui/button.tsx`, and `components/ui/card.tsx` exist.
- `prisma/schema.prisma` has only datasource/generator configuration.
- `lib/auth/`, `lib/validation/`, and `lib/audit/` are placeholder folders.

Missing for Phase 1:

- No user/session schema.
- No login page.
- No first-login setup page.
- No protected dashboard routes.
- No password hashing.
- No session cookie handling.
- No server-side authorization helpers.
- No seed user.
- No tests.

## Scope

- Add Prisma models for `User`, `Session`, `SetupToken`, and `AuditLog`.
- Add role and user status enums.
- Add secure password hashing using Node.js async `crypto.scrypt`.
- Add random DB-backed session tokens stored as SHA-256 hashes.
- Add HTTP-only session cookie handling.
- Add login server action.
- Add logout server action.
- Add first-login password setup server action.
- Add route authorization helpers.
- Add protected dashboard shell.
- Add role dashboard landing pages.
- Add `/login`, `/first-login`, and `/access-denied`.
- Add Super Admin seed script.
- Add validation with Zod.
- Add focused unit tests for pure auth rules, password hashing, and validation.

## Out of Scope

- OAuth/social login.
- Password reset by email.
- Email/SMS delivery.
- Full user management UI.
- Organization scoping.
- Employee profile and sensitive personal fields.
- Approval workflows.
- Notification center.
- Production rate limiting.
- Multi-factor authentication.

## Assumptions

- A custom credentials flow is acceptable for Phase 1 and avoids Auth.js adapter/version complexity.
- Session storage is database-backed and keyed by an HTTP-only cookie.
- Usernames are the primary login identifier; email can be added to user records but is optional for login.
- The seed Super Admin is created from environment variables and starts as `ACTIVE`.
- First-login setup is implemented for users with `PENDING_SETUP` or `mustChangePassword = true`.
- Setup links are token-based, but Phase 1 can also allow an authenticated pending user to complete setup through `/first-login`.

## Open Questions

- Exact production session duration is not specified. Phase 1 uses 7 days.
- Exact password policy is not specified. Phase 1 requires at least 10 characters, uppercase, lowercase, number, and symbol.
- Exact seeded Super Admin credentials are not specified. Phase 1 documents environment variables and uses safe local defaults only in the seed command.

## Data Model Changes

Add Prisma enums:

- `Role`
  - `PICKER`
  - `CHAMP`
  - `AREA_MANAGER`
  - `WORKFORCE_MANAGER`
  - `OPERATIONS_MANAGER`
  - `SENIOR_OPERATIONS_MANAGER`
  - `ADMIN`
  - `SUPER_ADMIN`
- `UserStatus`
  - `ACTIVE`
  - `PENDING_SETUP`
  - `ON_HOLD`
  - `SUSPENDED`
  - `RESIGNED`
  - `DELETED`

Add Prisma models:

- `User`
  - `id`
  - `name`
  - `username`
  - `email`
  - `phone`
  - `role`
  - `status`
  - `passwordHash`
  - `mustChangePassword`
  - `lastLoginAt`
  - timestamps
- `Session`
  - `id`
  - `userId`
  - `tokenHash`
  - `expiresAt`
  - timestamps
- `SetupToken`
  - `id`
  - `userId`
  - `tokenHash`
  - `expiresAt`
  - `usedAt`
  - timestamps
- `AuditLog`
  - `id`
  - `actorUserId`
  - `action`
  - `entityType`
  - `entityId`
  - `oldValueJson`
  - `newValueJson`
  - `ipAddress`
  - `userAgent`
  - `createdAt`

## Routes and Pages

Public routes:

- `/`
- `/docs`
- `/login`
- `/first-login`
- `/access-denied`

Protected dashboard routes:

- `/picker`
- `/champ`
- `/area-manager`
- `/workforce`
- `/operations`
- `/senior-operations`
- `/admin`
- `/super-admin`

## Components

Add:

- `components/layout/dashboard-shell.tsx`
- `components/auth/login-form.tsx`
- `components/auth/first-login-form.tsx`
- `components/ui/input.tsx`
- `components/ui/label.tsx`
- `components/ui/badge.tsx`

The dashboards are intentionally simple role landing pages. They must not pretend Phase 2+ business data exists.

## Server Actions / API Routes

Add server actions:

- `features/auth/actions.ts`
  - `loginAction`
  - `logoutAction`
  - `completeFirstLoginAction`

No API routes are required in Phase 1.

## Permissions and Access Control

- Unauthenticated users cannot access dashboard routes.
- Authenticated users can only access the dashboard matching their role unless they are `ADMIN` or `SUPER_ADMIN` where explicitly allowed later.
- Users with `PENDING_SETUP` or `mustChangePassword = true` can only access `/first-login` and logout.
- `ON_HOLD`, `SUSPENDED`, `RESIGNED`, and `DELETED` users cannot log in.
- Authorization is enforced in server components/helpers, not only in UI.

## Validation Rules

Use Zod schemas:

- Login
  - username required
  - password required
- First-login setup
  - token optional when user is already authenticated
  - password must satisfy the Phase 1 password policy
  - confirm password must match

## Notifications

No notification center exists yet. Phase 1 does not create notification records.

## Audit Logging

Create audit logs for:

- `AUTH_LOGIN_SUCCESS`
- `AUTH_LOGIN_FAILURE`
- `AUTH_LOGIN_BLOCKED_STATUS`
- `AUTH_LOGOUT`
- `AUTH_FIRST_LOGIN_COMPLETED`
- `AUTH_PASSWORD_SETUP_FAILED`

Audit logging must never store raw passwords or reusable tokens.

## Testing Plan

Add Vitest for unit tests.

Test:

- Role-to-dashboard redirects.
- Blocked user status rules.
- Pending setup access rules.
- Password policy validation.
- Password hashing verifies the correct password.
- Password hashing rejects an incorrect password.

Run:

```bash
npm test
npm run lint
npm run typecheck
npm run prisma:validate
npm run build
npm run validate
```

## Acceptance Criteria

- Spec file exists before implementation.
- Prisma schema contains user/session/setup-token/audit-log auth foundation.
- Super Admin seed command exists.
- Super Admin can log in.
- Authenticated users are redirected to their role dashboard.
- Protected dashboard routes are inaccessible without session.
- `PENDING_SETUP` users are forced to `/first-login`.
- Blocked statuses cannot log in.
- First-login password setup updates hashed password and activates user when appropriate.
- No plain-text password is stored.
- Critical auth mutations are audited.
- `npm test`, lint, typecheck, Prisma validation, and build pass.

## Risks and Mitigations

- **No local PostgreSQL database:** schema validation and build can pass without a DB; migration/seed require `DATABASE_URL`.
- **Custom auth complexity:** keep helpers small and test pure auth rules separately.
- **Session misuse:** store only hashed session tokens and set cookies as HTTP-only, same-site, secure in production.
- **Token leakage:** store setup token hashes only; never log raw setup tokens.
- **Route drift:** centralize role route mapping in `lib/auth/routing.ts`.

## Implementation Checklist

- [ ] Add Phase 1 spec file.
- [ ] Add Vitest and test scripts.
- [ ] Write failing unit tests for auth routing, status rules, validation, and password hashing.
- [ ] Add Prisma auth models and enums.
- [ ] Add password hashing utilities.
- [ ] Add auth validation schemas.
- [ ] Add role routing and access-rule helpers.
- [ ] Add session cookie and DB session helpers.
- [ ] Add audit logging helper.
- [ ] Add auth server actions.
- [ ] Add login and first-login UI.
- [ ] Add protected dashboard shell and role pages.
- [ ] Add Super Admin seed script.
- [ ] Update README and `.env.example`.
- [ ] Run validation and fix issues.
- [ ] Report changed files, validation results, known gaps, and next step.
