# Phase 2.6 - External IDs, Localization, and Preferences Foundation

## Goal

Prepare Pulse for future attendance, KPI, and order imports by adding stable external IDs for chains and branches, and prepare the application for future English/Arabic and Light/Dark/System user preferences.

## Current State

- Phase 2 organization core and Phase 2.5 HR ERP UI/UX foundation are present.
- `Chain`, `Branch`, `BranchAssignment`, and `ManagerRelation` exist.
- `EmployeeProfile` does not exist yet and remains Phase 3 scope.
- `orderSystemChainId` and `orderSystemBranchId` do not exist yet.
- Settings navigation is present as Coming Soon only.
- English is the current product UI language and the app uses a light theme.
- `docs/BLUEPRINT_SITEMAP.md` is referenced by docs and tests but is missing from the workspace.

## Scope

- Add optional unique order-system IDs to `Chain` and `Branch`.
- Update organization validation, server actions, queries, forms, and detail/list pages for the new IDs.
- Add lightweight localization config, direction helper, and starter dictionaries.
- Add lightweight appearance preference types and defaults.
- Add CSS token strategy for future theme switching without redesigning the app.
- Add safe Admin and Super Admin settings placeholder routes.
- Update navigation so settings points only to implemented routes.
- Restore and update `docs/BLUEPRINT_SITEMAP.md` and sync phase docs.
- Add tests for validation, schema, i18n direction, theme defaults, and settings access.

## Out of Scope

- Phase 3 `EmployeeProfile`.
- `shopperId` or `ibsId` database fields.
- User management or persisted user preferences.
- File imports, import batches, staging rows, or import center.
- Approvals, notifications, KPI tables, KPI dashboards, or fake operational data.
- Full translation of all existing UI.
- Full dark theme redesign.

## Data Model Changes

`Chain` gains:

- `orderSystemChainId String? @unique`

`Branch` gains:

- `orderSystemBranchId String? @unique`

The fields are nullable because manual setup can happen before external system IDs are known. PostgreSQL allows multiple `NULL` values in unique indexes, while non-null IDs remain unique.

## Routes and Pages

Add protected ERP-shell routes:

- `/admin/settings`
- `/admin/settings/preferences`
- `/super-admin/settings`
- `/super-admin/settings/preferences`

Update existing organization pages:

- Chain create/edit forms expose `Order System Chain ID`.
- Chain list/detail pages display the ID when present and show a short empty label when absent.
- Branch create/edit forms expose `Order System Branch ID`.
- Branch list/detail pages display the ID when present and show a short empty label when absent.

## Components

- Extend existing `ChainForm` and `BranchForm`.
- Add a small settings preferences display component if shared rendering avoids duplication.
- Reuse the ERP shell, page header, section cards, badges, and buttons.
- Keep copy short, professional, and English-only for this phase.

## Server Actions / APIs

Update existing organization server actions:

- `createChainAction`
- `updateChainAction`
- `createBranchAction`
- `updateBranchAction`

No new API routes are required. Settings pages do not save preferences in this phase.

## Permissions and Access Control

- Admin can access `/admin/settings` and `/admin/settings/preferences`.
- Super Admin can access `/admin/settings`, `/admin/settings/preferences`, `/super-admin/settings`, and `/super-admin/settings/preferences`.
- Normal roles cannot access admin settings.
- Server actions continue to enforce Admin/Super Admin organization mutation permissions server-side.

## Validation Rules

- External IDs are optional.
- External IDs are trimmed.
- Empty strings after trim are normalized to `null`.
- Non-empty external IDs are stored as provided after trimming.
- Duplicate non-null `orderSystemChainId` and `orderSystemBranchId` values are blocked by database unique constraints and surfaced as form errors.
- Supported languages are `en` and `ar`.
- Default language is `en`.
- `en` maps to `ltr`; `ar` maps to `rtl`.
- Supported theme preferences are `light`, `dark`, and `system`.
- Default theme is `light`.

## Audit Logging

Existing organization audit logs must include old/new values for the new external ID fields:

- `ORG_CHAIN_CREATED`
- `ORG_CHAIN_UPDATED`
- `ORG_BRANCH_CREATED`
- `ORG_BRANCH_UPDATED`

Preference changes are not audited in Phase 2.6 because preference persistence is not implemented.

## Testing Plan

- Extend organization validation tests for external ID acceptance, trimming, and empty-to-null normalization.
- Add schema tests confirming nullable unique external ID fields exist and `EmployeeProfile` remains absent.
- Add i18n direction tests for English and Arabic.
- Add preference tests for theme defaults and validation.
- Extend routing/navigation tests for settings access and implemented settings links.
- Run `npm run validate`.
- Run `npx prisma migrate status`.

## Acceptance Criteria

- Spec file exists before implementation code.
- Prisma schema and migration include nullable unique external IDs on Chain and Branch.
- Chain and branch create/edit flows accept optional external IDs.
- Duplicate external IDs are blocked.
- Organization pages show the new IDs without using names as future import keys.
- Localization foundation exists with supported languages, default language, and direction helper.
- Theme preference foundation exists with Light/Dark/System values and a light default.
- Settings placeholder routes render through the ERP shell and do not claim persistence.
- Settings navigation links only to implemented safe routes.
- Docs are synced with Phase 2.6, Phase 9.5, Phase 10.5, external IDs, and execution order.
- No Phase 3 employee profile work, imports, approvals, notifications, KPIs, or fake data are implemented.
- `npm run validate` passes.
- `npx prisma migrate status` reports the local database is up to date.

## Risks and Mitigations

- **Scope creep into Phase 3:** document `shopperId` and `ibsId` only; do not add fields or models.
- **Users think settings persist:** mark settings pages as foundation/coming soon and avoid save actions.
- **External ID duplicates:** rely on database unique constraints and return clear form errors.
- **Theme regressions:** preserve current light variables and only add a future data-attribute strategy.
- **Missing sitemap doc:** restore `docs/BLUEPRINT_SITEMAP.md` from the existing blueprint content and keep references stable.

## Implementation Checklist

- [ ] Restore/update `docs/BLUEPRINT_SITEMAP.md`.
- [ ] Add failing tests for validation, schema, i18n, preferences, routing, and navigation.
- [ ] Add Prisma fields and migration.
- [ ] Update organization validation schemas and action payloads.
- [ ] Update organization forms and display pages.
- [ ] Add i18n foundation helpers.
- [ ] Add preferences foundation helpers.
- [ ] Add settings placeholder pages.
- [ ] Update navigation.
- [ ] Sync `agent.md`, `docs/PHASES.md`, and sitemap docs.
- [ ] Run validation and migration status.
- [ ] Verify runtime routes and no Phase 3/import/fake-data work exists.
