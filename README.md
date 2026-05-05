# Plus

Plus is an internal operations platform for managing Pickers, Champs, managers, branches, approvals, notifications, and future KPI reporting.

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

## Environment Variables

Required variables are documented in `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/plus?schema=public"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
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
