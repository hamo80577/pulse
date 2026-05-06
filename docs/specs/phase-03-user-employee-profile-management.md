# Phase 3 - User and Employee Profile Management

## Goal

Build controlled Admin/Super Admin user and employee profile management for Pulse, including safe user creation, profile editing, employee external IDs, status changes, password reset forcing, and local demo user seeding.

## Current State

- Phase 0, Phase 1, Phase 2, Phase 2.5, and Phase 2.6 are complete.
- `User`, auth sessions, setup tokens, audit logs, organization models, and ERP shell routes exist.
- `Chain.orderSystemChainId` and `Branch.orderSystemBranchId` exist.
- `EmployeeProfile`, `shopperId`, and `ibsId` do not exist yet.
- Settings placeholders exist, but user preference persistence is not implemented.
- No import center, approvals, notifications, KPIs, file uploads, or fake performance data exist.

## Scope

- Add `EmployeeProfile` and `EmploymentStatus`.
- Add one-to-one `User` to `EmployeeProfile` relation.
- Add Admin/Super Admin workforce routes under `/admin/workforce`.
- Add user list, filters, search, new user form, user detail, profile edit, and assignment summary pages.
- Add server actions for creating users, updating users/profile data, and forcing password reset.
- Add Zod validation for user and profile payloads.
- Add safe Prisma selects for user management queries.
- Add audit logs for user/profile/password reset mutations.
- Add local-only `npm run seed:demo-users`.
- Update navigation so Workforce points to `/admin/workforce`.
- Keep `/admin/users` as a redirect to `/admin/workforce/users` for older docs/links.

## Out of Scope

- Approvals.
- Notifications.
- KPIs or performance data.
- Attendance/KPI imports or import center.
- Actual file upload handling.
- Object storage integration.
- User preference persistence.
- Physical user deletion.
- Exposing sensitive profile data to normal roles.

## Data Model Changes

Add enum `EmploymentStatus`:

- `ACTIVE`
- `ON_LEAVE`
- `ON_HOLD`
- `RESIGNED`
- `TERMINATED`

Add model `EmployeeProfile`:

- `id`
- `userId` unique
- `nationalId` optional unique
- `shopperId` optional unique
- `ibsId` optional unique
- `address` optional
- `personalPhotoUrl` optional
- `idCardFrontUrl` optional
- `idCardBackUrl` optional
- `hireDate` optional
- `employmentStatus`
- `createdAt`
- `updatedAt`

Update `User` with one optional `employeeProfile` relation. Do not expose `passwordHash`, sessions, or setup token hashes to client components.

## Routes and Pages

Add:

- `/admin/workforce`
- `/admin/workforce/users`
- `/admin/workforce/users/new`
- `/admin/workforce/users/[userId]`
- `/admin/workforce/users/[userId]/profile`
- `/admin/workforce/users/[userId]/assignments`
- `/admin/users` redirecting to `/admin/workforce/users`

Super Admin accesses the same admin workforce routes through existing admin route-family authorization.

## Components

Add user/workforce components under `features/users/components/`:

- workforce overview cards
- user filters/list
- new/edit user form
- profile form
- user detail sections
- assignment summary
- account/security section

Reuse ERP shell and existing UI primitives: `PageHeader`, `SectionCard`, `EmptyState`, `StatusBadge`, `MetricCard`, `ActionCard`, `ModuleCard`, `Button`, and `Card`.

## Server Actions / APIs

Add server actions under `features/users/actions.ts`:

- `createUserAction`
- `updateUserAndProfileAction`
- `forcePasswordResetAction`

No API routes are required.

User creation creates:

- `User` with `mustChangePassword=true`
- hashed temporary password
- `EmployeeProfile`
- setup token
- audit log

The temporary setup token is not displayed in normal UI. Local demo seed writes generated credentials only to `LOCAL_CREDENTIALS.md`.

## Permissions and Access Control

- Admin and Super Admin can access workforce pages and mutations.
- Normal roles cannot access `/admin/workforce`.
- Sensitive profile fields are restricted to Admin/Super Admin in Phase 3.
- Every mutation validates role server-side.
- UI hiding is not considered authorization.

## Validation Rules

- Trim strings.
- Empty optional strings normalize to `null`.
- `name` required.
- `username` required and unique.
- `email` optional and unique when provided.
- `phone` optional.
- `role` must be a valid Pulse role.
- `status` must be a valid user status.
- `nationalId` optional and unique when provided.
- `shopperId` optional and unique when provided.
- `ibsId` optional and unique when provided.
- `hireDate` optional and valid when provided.
- `employmentStatus` must be valid.
- `shopperId` and `ibsId` are stable IDs, not names.
- Names must not be used as future import matching keys.

## Notifications

No notifications are implemented in Phase 3.

## Audit Logging

Create audit logs for:

- `USER_CREATED`
- `USER_UPDATED`
- `EMPLOYEE_PROFILE_CREATED`
- `EMPLOYEE_PROFILE_UPDATED`
- `USER_PASSWORD_RESET_FORCED`

Audit payloads must not include passwords, password hashes, session tokens, setup token hashes, or reusable plain-text credentials.

## Testing Plan

- Schema tests for `EmployeeProfile`, nullable unique `nationalId`, `shopperId`, and `ibsId`.
- Validation tests for user/profile payloads and optional string normalization.
- Query security tests for safe selects and no `passwordHash`/token exposure.
- Permission tests for Admin/Super Admin workforce access and Picker/Champ denial.
- Action tests or pure helper tests confirming user creation data sets `mustChangePassword=true`.
- Demo seed tests confirming production guard and credentials file target.
- Runtime tests for protected routes and user creation flows.
- Run `npm run validate`.
- Run `npx prisma migrate status`.

## Acceptance Criteria

- Spec exists before implementation.
- Migration adds `EmployeeProfile` and `EmploymentStatus`.
- Admin/Super Admin can view, filter, search, create, and edit users.
- Created users get `EmployeeProfile`.
- Created users require first-login password change.
- Picker/Champ external IDs can be saved and are unique when provided.
- Duplicate `nationalId`, `shopperId`, and `ibsId` are blocked.
- Password reset forcing sets `mustChangePassword=true` and audits the action.
- Sensitive fields do not reach unauthorized roles or unsafe client payloads.
- `npm run seed:demo-users` is local-only, blocked in production, and writes credentials only to `LOCAL_CREDENTIALS.md`.
- `LOCAL_CREDENTIALS.md` remains ignored and untracked.
- No approvals, notifications, KPIs, imports, file uploads, or fake performance data are implemented.
- `npm run validate` passes.
- `npx prisma migrate status` reports the database is up to date.

## Risks and Mitigations

- **Sensitive data leakage:** use explicit safe selects and tests scanning user feature files.
- **Plain-text password exposure:** never render passwords; local seed writes only to ignored `LOCAL_CREDENTIALS.md`.
- **Scope creep into imports/KPIs/approvals:** keep only external ID storage and profile management.
- **Broken legacy links:** redirect `/admin/users` to `/admin/workforce/users`.
- **Production seed risk:** hard-fail demo seed when `NODE_ENV === "production"`.

## Implementation Checklist

- [ ] Add Phase 3 tests first.
- [ ] Add Prisma enum/model/relation and migration.
- [ ] Add user validation schemas.
- [ ] Add user permissions, safe selects, queries, and mutation helpers.
- [ ] Add user server actions with audit logging.
- [ ] Add workforce routes and components.
- [ ] Add `/admin/users` redirect.
- [ ] Update navigation.
- [ ] Add local demo seed command and tests.
- [ ] Run migration and validation.
- [ ] Perform runtime verification.
