# Phase 2 — Organization Core

## Goal

Build the Pulse organization foundation for chains, branches, branch assignment history, manager relations, and an admin organization tree.

## Current State

- Phase 1 authentication, role routing, protected dashboard layouts, Super Admin seeding, and Pulse branding are in place.
- Admin and Super Admin can access `/admin` and nested admin routes.
- Prisma currently contains authentication/session/audit models only.
- No organization tables, admin organization routes, or branch assignment history exist yet.

## Scope

- Add Prisma models for `Chain`, `Branch`, `BranchAssignment`, and `ManagerRelation`.
- Add organization status and assignment/relation enums.
- Add validation schemas for chain, branch, assignment, and manager relation payloads.
- Add scoped organization query helpers for Admin/Super Admin use.
- Add server actions for direct Admin/Super Admin creation and assignment operations.
- Add audit logs for organization mutations.
- Add admin pages for chains, branches, assignment, manager relations, and organization tree viewing.
- Add focused unit tests for validation and organization business rules.
- Create and apply a Phase 2 Prisma migration.

## Out of Scope

- Phase 3 user and employee profile management.
- Creating new users from organization pages.
- Employee sensitive profile fields, national IDs, photos, or file uploads.
- Approval workflows, notifications, KPIs, or reporting dashboards.
- Seeded fake chains, branches, assignments, manager relations, or fake operational data.
- Non-admin self-service branch assignment.

## Data Model Changes

Add:

- `OrganizationStatus`
  - `ACTIVE`
  - `INACTIVE`
  - `ARCHIVED`
- `BranchAssignmentRole`
  - `PICKER`
  - `CHAMP`
- `AssignmentStatus`
  - `ACTIVE`
  - `ENDED`
- `ManagerRelationType`
  - `CHAMP_TO_PICKER`
  - `AREA_MANAGER_TO_CHAMP`
  - `OPERATIONS_TO_AREA_MANAGER`
- `ManagerRelationStatus`
  - `ACTIVE`
  - `ENDED`
- `Chain`
  - name, optional code, status, timestamps
- `Branch`
  - chain relation, name, optional code/address, status, timestamps
- `BranchAssignment`
  - user, branch, role at branch, start/end dates, primary flag, status, creator
- `ManagerRelation`
  - employee user, manager user, relation type, start/end dates, status

Rules:

- Branch belongs to exactly one chain.
- Picker/Champ branch placement uses `BranchAssignment`; do not add `branchId` to `User`.
- Assignment changes preserve old rows.
- Active primary duplicate assignments for the same user and role are blocked by server-side validation.
- Manager relations preserve old rows when ended.

## Routes and Pages

Add protected Admin/Super Admin pages:

- `/admin/organization`
- `/admin/organization/tree`
- `/admin/organization/chains`
- `/admin/organization/chains/new`
- `/admin/organization/chains/[chainId]`
- `/admin/organization/branches`
- `/admin/organization/branches/new`
- `/admin/organization/branches/[branchId]`

The admin organization index links to chains, branches, and the tree. Detail pages show current state and forms for the next allowed direct operation. If no eligible users exist yet, assignment forms show a clear empty state instead of fake users.

## Components

Add organization components under `features/organization/components/`:

- `organization-home.tsx`
- `chain-form.tsx`
- `branch-form.tsx`
- `assignment-form.tsx`
- `manager-relation-form.tsx`
- `organization-tree.tsx`
- `organization-list.tsx`

Use existing local UI primitives and keep layouts dense, restrained, and internal-tool focused.

## Server Actions / APIs

Add server actions in `features/organization/actions.ts`:

- `createChainAction`
- `updateChainAction`
- `createBranchAction`
- `updateBranchAction`
- `createBranchAssignmentAction`
- `endBranchAssignmentAction`
- `createManagerRelationAction`
- `endManagerRelationAction`

No API routes are required.

## Permissions and Access Control

- Only Admin and Super Admin can access direct organization creation and mutation pages in Phase 2.
- Server actions must call the existing authenticated session helper and enforce role access server-side.
- Super Admin can access the same admin organization routes through the existing nested admin RBAC behavior.
- Normal roles cannot access `/admin/organization` or mutate organization data.

## Validation Rules

- Chain name is required.
- Chain code is optional and normalized to uppercase when provided.
- Branch name is required.
- Branch must reference an existing chain.
- Branch code is optional and normalized to uppercase when provided.
- Assignment user must exist and have role `PICKER` or `CHAMP`.
- Assignment role must match the selected user's role.
- Assignment branch must exist.
- Assignment start date must be valid.
- Active primary duplicate assignments for the same user and role are blocked.
- Manager and employee must be different users.
- Manager relation type must match allowed role pairs.

## Notifications

No notification center exists in Phase 2. Organization mutations do not create notification records.

## Audit Logging

Create audit logs for:

- `ORG_CHAIN_CREATED`
- `ORG_CHAIN_UPDATED`
- `ORG_BRANCH_CREATED`
- `ORG_BRANCH_UPDATED`
- `ORG_BRANCH_ASSIGNMENT_CREATED`
- `ORG_BRANCH_ASSIGNMENT_ENDED`
- `ORG_MANAGER_RELATION_CREATED`
- `ORG_MANAGER_RELATION_ENDED`

Audit logs must not include passwords, raw tokens, or sensitive auth internals.

## Testing Plan

Add Vitest tests for:

- Chain and branch validation.
- Assignment validation and role matching.
- Manager relation role-pair rules.
- Active primary duplicate assignment rule helper.
- Organization RBAC helper allowing only Admin/Super Admin mutation access.

Run:

```bash
npm test
npm run prisma:generate
npm run prisma:migrate
npm run validate
```

## Acceptance Criteria

- Spec file exists before implementation.
- Prisma schema includes chain, branch, branch assignment, and manager relation models.
- Phase 2 Prisma migration exists and is applied.
- Admin can create a chain.
- Admin can create a branch under a chain.
- Admin can assign an existing Picker or Champ to a branch.
- Admin can create a manager relation for valid role pairs.
- Organization tree displays chain -> branch -> assigned users.
- Assignment history is preserved when assignments are ended and replaced.
- Server-side authorization blocks non-admin organization mutations.
- Organization mutations create audit logs.
- No fake chains, branches, assignments, users, KPIs, or operational records are seeded.
- `npm run validate` passes.

## Risks and Mitigations

- **No eligible Picker/Champ users yet:** show empty assignment states and keep user creation in Phase 3.
- **Duplicate active assignments:** enforce through server-side queries because PostgreSQL partial unique constraints are not represented directly in Prisma schema.
- **Scope creep into approvals or profiles:** keep Phase 2 limited to organization structure and assignment history.
- **Route drift:** use existing nested admin RBAC behavior and central organization helpers.

## Implementation Checklist

- [ ] Add Phase 2 spec file.
- [ ] Add failing organization validation and rule tests.
- [ ] Add Prisma organization enums/models and user relations.
- [ ] Generate and apply Phase 2 migration.
- [ ] Add validation schemas and organization rule helpers.
- [ ] Add scoped query helpers.
- [ ] Add organization server actions with audit logging.
- [ ] Add admin organization routes and components.
- [ ] Run tests, Prisma validation, typecheck, lint, build, and full validation.
- [ ] Verify admin routes at runtime.
