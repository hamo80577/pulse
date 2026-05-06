# Phase 2.5 — HR ERP Experience Foundation

## Goal

Make Pulse feel like a professional internal HR ERP workforce system while keeping Phase 2 data honest and secure.

## Current State

- Phase 2 organization models, routes, forms, and actions exist.
- Admin and Super Admin can access organization routes.
- The UI is functional but reads as raw CRUD instead of an ERP workspace.
- Some organization queries return full Prisma `User` records to route components and client components.

## Scope

- Harden Phase 2 organization queries so no full `User` records are returned or passed to client components.
- Harden Phase 2 server actions to enforce active chain, branch, and user state rules before mutations.
- Add database partial unique indexes for active primary assignments and active manager relations.
- Add an ERP shell with sidebar, topbar, role badge, user name, logout, active nav state, and clean content area.
- Add central navigation config for Admin and Super Admin workspaces.
- Redesign Admin and Super Admin dashboards as ERP workspaces.
- Redesign `/admin/organization` as an Organization Workbench.
- Improve organization list/detail/form pages with clearer layout, shorter copy, and empty states.
- Add reusable UI primitives for ERP status, empty states, section cards, metric cards, action cards, and module cards.
- Lightly refine `app/globals.css` for a professional light HR ERP feel.

## Out of Scope

- Phase 3 user and employee profile management.
- Fake users, fake KPIs, fake operational records, or seeded demonstration data.
- Approvals, notifications, audit-log UI, settings UI, or request workflows.
- Secret changes or committing `.env` / `LOCAL_CREDENTIALS.md`.
- Dark theme.

## Files To Change

- `features/organization/queries.ts`
- `features/organization/actions.ts`
- `features/organization/rules.ts`
- `features/organization/*.test.ts`
- `app/(dashboard)/admin/page.tsx`
- `app/(dashboard)/super-admin/page.tsx`
- `app/(dashboard)/admin/organization/**`
- `components/dashboards/role-dashboard.tsx`
- `components/layout/erp-shell.tsx`
- `components/layout/sidebar-nav.tsx`
- `components/layout/topbar.tsx`
- `components/layout/page-header.tsx`
- `components/ui/status-badge.tsx`
- `components/ui/empty-state.tsx`
- `components/ui/section-card.tsx`
- `components/ui/metric-card.tsx`
- `components/ui/action-card.tsx`
- `components/ui/module-card.tsx`
- `lib/navigation/nav-items.ts`
- `app/globals.css`
- `prisma/migrations/*_phase_02_security_indexes/migration.sql`

## Security Rules

- Organization queries must never use `user: true` or `createdBy: true`.
- Organization user selections must use explicit `select` with only `id`, `name`, `role`, and optionally `phone` or `status` when needed.
- Full Prisma `User` records must never be passed to client components.
- `createBranchAction` must require the selected chain to be `ACTIVE`.
- `updateBranchAction` must require the selected chain to be `ACTIVE`.
- `createBranchAssignmentAction` must require:
  - existing active user
  - user role `PICKER` or `CHAMP`
  - assignment role matching user role
  - existing active branch
  - active branch chain
- `createManagerRelationAction` must require active employee and manager users and a valid role pair.
- Database must enforce one active primary assignment per user/assignment role and one active manager relation per employee/relation type.

## UI Direction

- Clean HR ERP system.
- Employee-first and operations-focused.
- Desktop-first with responsive fallback.
- Dense enough for repeated internal use, but not crowded.
- Short headings, short helper text, clear next actions.
- No long paragraphs.
- No fake data or fake KPIs.
- Forms should have one main action per screen.
- Empty states should explain the next real setup step.

## Navigation

Admin and Super Admin navigation:

- Dashboard
- Workforce
- Organization
- Requests
- Approvals
- Notifications
- Audit Logs
- Settings

Only Dashboard and Organization link to existing routes. Other nav items are visibly marked as Coming Soon and do not navigate to missing routes.

## Dashboard Experience

Admin and Super Admin dashboards should include:

- Welcome header.
- Setup progress based on real counts.
- Quick actions for organization setup.
- Organization entry point.
- Access/security card.
- Empty states when setup data does not exist.

## Organization Workbench

`/admin/organization` should show five clear work areas:

1. Chains
2. Branches
3. Assign People
4. Manager Relations
5. Review Tree

It should include setup progress, quick actions, real counts only, short guidance, and no fake data.

## Validation Plan

- Add tests that scan organization code for unsafe user includes and user queries without explicit `select`.
- Add tests for active status rule helpers.
- Run `npm run validate`.
- Run `npx prisma migrate status`.
- Runtime-check:
  - `/` redirects correctly
  - `/login` is Pulse-branded
  - `/admin` and `/super-admin` render ERP dashboards
  - `/admin/organization` renders the Organization Workbench
  - chain, branch, and tree pages are clear
  - no broken navigable links to missing modules
  - no legacy branding
  - no sensitive user fields in rendered HTML

## Acceptance Criteria

- Spec exists before UI implementation.
- Organization query audit passes.
- Server action active-state hardening is implemented.
- Partial unique index migration exists and is applied.
- ERP shell, nav, topbar, and page header exist.
- Admin/Super Admin dashboards use the ERP shell and show real setup state.
- Organization Workbench uses workflow-oriented cards and real counts.
- Organization pages have clearer empty states and compact forms.
- New reusable UI primitives exist and are used on the dashboard/workbench surfaces.
- `npm run validate` passes.
- `npx prisma migrate status` reports the local database is up to date.
- Runtime checks pass without creating fake users, KPIs, approvals, or notifications.
