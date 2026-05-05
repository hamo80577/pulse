# Phase 1 Branding and UI Alignment

## Goal

Align the Phase 1 application and documentation around the Pulse product identity before Phase 2 begins. The app should present Pulse consistently, route users into the authentication flow from the root path, and keep dashboards free of placeholder operational data.

## Current State

- The codebase is in Phase 1 with authentication, role routing, protected layouts, Prisma migrations, and local PostgreSQL runtime verification in place.
- Some visible UI, metadata, documentation, and technical identifiers still use the legacy product name.
- The root route still renders a bootstrap foundation page instead of sending users to the correct authentication or dashboard destination.
- Dashboard copy confirms Phase 1 access behavior but does not yet use role-specific Pulse workspace language.

## Scope

- Replace legacy product branding with Pulse in user-facing UI and project documentation.
- Update safe local technical names to use the `pulse_*` convention, including the session cookie name.
- Replace the root foundation page with server-side routing through existing authentication helpers.
- Update login, docs, and dashboard copy to match the Pulse internal operations portal.
- Preserve the existing Phase 1 authentication, RBAC, seed, migration, and validation behavior.

## Out of Scope

- Phase 2 work.
- Chains, branches, assignments, manager relations, approvals, notifications, KPIs, organization pages, or fake business data.
- Database schema changes or new Prisma migrations.
- Real credential changes in committed files.
- Public marketing navigation or public product pages.

## Files To Change

- `agent.md`
- `README.md`
- `docs/README.md`
- `docs/BLUEPRINT_SITEMAP.md`
- `docs/PHASES.md`
- `docs/specs/phase-00-project-bootstrap.md`
- `docs/specs/phase-01-auth-roles-protected-layouts.md`
- `app/layout.tsx`
- `app/page.tsx`
- `app/docs/page.tsx`
- `app/(auth)/login/page.tsx`
- `app/(auth)/first-login/page.tsx`
- `components/layout/app-shell.tsx`
- `components/layout/dashboard-shell.tsx`
- `components/dashboards/role-dashboard.tsx`
- `lib/auth/session.ts`
- `package.json`
- `package-lock.json`
- `.env.example`

## Branding Rules

- Product, app, website, UI, page titles, metadata, README, docs, and agent identity must use Pulse.
- Local infrastructure examples must use the repository-aligned `pulse_*` naming convention.
- Session cookies should use `pulse_session`.
- Committed docs and examples must contain placeholders only and must never include real secrets.
- Existing local `.env` and `LOCAL_CREDENTIALS.md` remain ignored and uncommitted.

## UI Routing Behavior

- `/` redirects unauthenticated users to `/login`.
- `/` redirects authenticated users with first-login requirements to `/first-login`.
- `/` redirects authenticated active users to their correct role dashboard.
- `/login` keeps using the existing authenticated-user redirect helper.
- Protected dashboard routes keep using existing session and RBAC helpers.

## Validation Plan

- Add a regression test that guards against legacy visible branding and the legacy session cookie name in committed source and documentation.
- Run `npm run validate`, including lint, tests, typecheck, Prisma validation, and build.
- Verify ignored secret files with:
  - `git check-ignore .env`
  - `git check-ignore LOCAL_CREDENTIALS.md`
  - `git status --short`
- Run the dev server and verify route behavior for `/`, `/login`, `/admin`, and `/super-admin`.
- Verify Super Admin can still log in with local-only credentials and access `/super-admin` and `/admin`.

## Acceptance Criteria

- No committed user-facing or documentation files retain the legacy product branding.
- Metadata, page titles, shells, login, docs, and dashboards use Pulse consistently.
- The session cookie name is `pulse_session`.
- Root routing uses existing auth helpers and no longer displays a foundation page.
- Dashboards contain role-specific Pulse copy and no fake counts, KPIs, or operational records.
- `.env` and `LOCAL_CREDENTIALS.md` are ignored, untracked, and unstaged.
- `npm run validate` passes.
- Runtime route checks and Super Admin access checks pass.
