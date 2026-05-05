# Pulse

Pulse is an internal operations platform for managing Pickers, Champs, managers, branches, approvals, notifications, and future KPI reporting.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style local components
- Prisma
- PostgreSQL
- npm

## Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
copy .env.example .env
```

Update `DATABASE_URL` in `.env` for your local PostgreSQL database.

## npm Scripts

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run the production server after building:

```bash
npm run start
```

Run ESLint:

```bash
npm run lint
```

Run TypeScript checks:

```bash
npm run typecheck
```

Run all Phase 0 validation checks:

```bash
npm run validate
```

Run tests:

```bash
npm test
```

## Prisma Commands

Generate Prisma Client:

```bash
npm run prisma:generate
```

Validate the Prisma schema:

```bash
npm run prisma:validate
```

Format the Prisma schema:

```bash
npm run prisma:format
```

Create and apply a development migration:

```bash
npm run prisma:migrate
```

Open Prisma Studio:

```bash
npm run prisma:studio
```

Seed the Super Admin user:

```bash
$env:SUPER_ADMIN_PASSWORD="Use-A-Strong-Password1!"
npm run seed:super-admin
```

The seeded Super Admin is `ACTIVE` and is forced to change password on first login by default. For local-only development, set `SUPER_ADMIN_FORCE_PASSWORD_CHANGE="false"` before running the seed command.

## Environment Variables

Required variables are documented in `.env.example`:

```env
DATABASE_URL="postgresql://pulse_app:replace-with-a-local-password@localhost:5433/pulse_local?schema=public"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
SUPER_ADMIN_USERNAME="superadmin"
SUPER_ADMIN_PASSWORD="replace-with-a-strong-local-seed-password"
SUPER_ADMIN_NAME="Super Admin"
SUPER_ADMIN_EMAIL="superadmin@example.com"
SUPER_ADMIN_FORCE_PASSWORD_CHANGE="true"
```

Authentication is implemented in Phase 1. The `NEXTAUTH_*` variables are included now so the environment structure is ready.

## Phase 0 Validation

Phase 0 is accepted when these commands run and results are reported:

```bash
npm run lint
npm run typecheck
npm run prisma:validate
npm run build
npm run validate
```

## Phase 1 Auth

Phase 1 uses a custom credentials flow with database-backed sessions:

- Passwords are hashed with async Node.js `scrypt`.
- Session cookies are HTTP-only and store only a random token.
- The database stores only the SHA-256 hash of each session token.
- Blocked account statuses cannot log in.
- Users with pending setup or forced password change are redirected to `/first-login`.
- Admin can access `/admin` and nested admin routes; Super Admin can access all protected dashboard route families.
