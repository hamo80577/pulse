# Phase 00 — Project Bootstrap

## Goal

Create a fresh, in-place Next.js foundation for Pulse using npm, TypeScript, Tailwind CSS, Prisma, PostgreSQL configuration, shadcn/ui-style components, and a simple internal operations app shell.

## Current State

The workspace currently contains planning documents only:

- `agent.md`
- `BLUEPRINT_SITEMAP.md`
- `PHASES.md`

There is no Git repository metadata, no `package.json`, no application code, no Prisma schema, and no existing test/build tooling.

## Scope

- Initialize a Next.js App Router project in the current directory.
- Use npm only and create `package-lock.json`.
- Add TypeScript and strict project configuration.
- Add Tailwind CSS and global design tokens.
- Add shadcn/ui-style local component setup with `components.json`, `cn()`, and starter UI primitives.
- Add Prisma with a PostgreSQL datasource.
- Add `.env.example` documenting required environment variables.
- Add base folders:
  - `app/`
  - `components/`
  - `features/`
  - `lib/`
  - `prisma/`
  - `docs/`
  - `docs/specs/`
- Add a basic app shell and first route.
- Move project planning copies into `docs/BLUEPRINT_SITEMAP.md` and `docs/PHASES.md`.
- Add a README with setup and command documentation.
- Add npm scripts for development, validation, build, and Prisma workflows.

## Out of Scope

- Authentication implementation.
- User, organization, approval, notification, audit, and KPI business logic.
- Database migrations beyond baseline Prisma schema setup.
- Seed users.
- File upload integration.
- Production deployment automation.

## Assumptions

- npm is the only package manager.
- This is a single app repository, not a monorepo.
- PostgreSQL is configured externally by the developer.
- Phase 0 can include only a baseline Prisma schema and client wiring; business models start in later phases.
- The initial UI should be a professional placeholder shell, not fake operational data or completed dashboards.

## Open Questions

- Exact production database host and credentials are not known. They will be supplied through `.env`.
- Deployment target details are not known. Deployment notes are limited to local setup and VPS-compatible npm commands.

## Data Model Changes

Create `prisma/schema.prisma` with:

- PostgreSQL datasource.
- Prisma Client generator outputting to `generated/prisma`.
- `prisma.config.ts` using `DATABASE_URL` for Prisma CLI commands.
- No business tables yet.

This keeps Phase 0 focused on infrastructure and avoids pretending later domain models are complete.

## Routes and Pages

- `/` — initial app shell landing screen for Pulse with links/context for future role dashboards.
- `/docs` — documentation index pointing to local planning files.

No protected routes are implemented in Phase 0.

## Components

Create starter reusable UI and layout components:

- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/layout/app-shell.tsx`

The components use Tailwind semantic tokens and a shadcn/ui-style `cn()` helper.

## Server Actions / API Routes

No server actions or API routes are created in Phase 0.

## Permissions and Access Control

No authentication or authorization exists in Phase 0. All permission-sensitive behavior is deferred to Phase 1.

Phase 0 must not create UI that implies protected business workflows are already implemented.

## Validation Rules

No mutation validation is required because Phase 0 does not add mutations.

Project validation is handled through npm scripts:

```bash
npm run lint
npm run typecheck
npm run build
npm run validate
```

## Notifications

No notification logic is implemented in Phase 0.

## Audit Logging

No audit logging is implemented in Phase 0 because there are no business mutations.

## Environment Variables

Create `.env.example`:

```env
DATABASE_URL="postgresql://pulse_app:replace-with-a-local-password@localhost:5433/pulse_local?schema=public"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

`NEXTAUTH_*` variables are documented now because Phase 1 will add authentication.

## Dependencies

Runtime dependencies:

- `next`
- `react`
- `react-dom`
- `@prisma/client`
- `@prisma/adapter-pg`
- `class-variance-authority`
- `clsx`
- `dotenv`
- `tailwind-merge`
- `lucide-react`
- `pg`

Development dependencies:

- `typescript`
- `@types/node`
- `@types/react`
- `@types/react-dom`
- `eslint`
- `eslint-config-next`
- `tailwindcss`
- `@tailwindcss/postcss`
- `prisma`

## npm Scripts

Create these scripts in `package.json`:

```json
{
  "dev": "prisma generate && next dev",
  "build": "prisma generate && next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "prisma generate && tsc --noEmit",
  "validate": "npm run lint && npm run typecheck && npm run build",
  "prisma:generate": "prisma generate",
  "prisma:validate": "prisma validate",
  "prisma:format": "prisma format",
  "prisma:migrate": "prisma migrate dev",
  "prisma:studio": "prisma studio"
}
```

If the installed Next.js version no longer supports `next lint`, use ESLint directly while preserving the `npm run lint` command.

## Testing Plan

Phase 0 validation is command-based:

- `npm install` creates `package-lock.json`.
- `npm run lint` checks source quality.
- `npm run typecheck` checks TypeScript.
- `npm run build` checks production compilation and Prisma client generation.
- `npm run validate` runs the full validation sequence.
- `npm run prisma:validate` verifies Prisma schema syntax.

No unit tests are planned because Phase 0 does not introduce business functions or mutable behavior.

## Acceptance Criteria

- `package.json` and `package-lock.json` exist.
- No `pnpm-lock.yaml` or `yarn.lock` exists.
- The project runs with `npm run dev`.
- The folder structure exists.
- Prisma is configured for PostgreSQL.
- Environment variables are documented in `.env.example`.
- README documents install, development, validation, and Prisma commands.
- `docs/specs/phase-00-project-bootstrap.md` exists.
- `docs/BLUEPRINT_SITEMAP.md` and `docs/PHASES.md` exist.
- Validation commands run and results are reported.
- No placeholder business logic pretends later phases are complete.

## Risks and Mitigations

- **Next.js CLI or lint behavior changes:** keep script names stable and adjust implementation to the installed toolchain.
- **No local PostgreSQL database:** Phase 0 avoids database connection-dependent migrations and validates only Prisma schema/client generation.
- **Fresh non-Git workspace:** report changed files through filesystem inspection instead of Git diff.
- **Windows compatibility:** use npm scripts and paths that work in PowerShell and VS Code.

## Implementation Checklist

- [ ] Create the required docs/specs directory and this spec file.
- [ ] Create `package.json` using npm scripts only.
- [ ] Install npm dependencies and generate `package-lock.json`.
- [ ] Add Next.js, TypeScript, Tailwind, ESLint, and PostCSS configuration.
- [ ] Add app route files and global CSS.
- [ ] Add shadcn/ui-style configuration and starter components.
- [ ] Add `lib/utils.ts` and `lib/db/prisma.ts`.
- [ ] Add `prisma/schema.prisma`.
- [ ] Add `prisma.config.ts`.
- [ ] Add `.env.example`.
- [ ] Add README command documentation.
- [ ] Copy planning docs into `docs/`.
- [ ] Run Prisma validation and project validation commands.
- [ ] Report changed files, validation results, known gaps, and next step.
