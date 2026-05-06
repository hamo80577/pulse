# Phase 3 - Assignment Profile UX Correction

## Goal

Move branch assignment and manager relation creation out of the Organization Workbench and into employee profile/workforce screens.

## UX Decision

Assignments are employee lifecycle/profile actions. Organization pages manage structure: chains, branches, the organization tree, counts, setup progress, and structure health. Workforce user profiles manage where a person works and who they report to.

## Required Workflow

Admin and Super Admin users assign employees from:

- `/admin/workforce/users/[userId]`
- `/admin/workforce/users/[userId]/assignments`

The selected employee is always the profile user. Assignment and manager relation forms must not ask for a separate employee/user dropdown.

## Organization Workbench Changes

`/admin/organization` must keep:

- Chains
- Branches
- Organization tree link
- Organization counts
- Active assignment count
- Active manager relation count
- Setup progress

`/admin/organization` must remove:

- Direct Assign People creation form
- Direct Manager Relations creation form

Replace removed forms with guidance that assignments are managed from employee profiles, plus links to Workforce and Organization Tree.

## User Profile Changes

`/admin/workforce/users/[userId]` must show clear sections for:

- Overview
- Profile
- Assignments
- Manager Relations
- Security

The Assignments section shows current active branch assignment, assignment history, an Add branch assignment form, and end active assignment actions when allowed.

The Manager Relations section shows current manager, direct reports, relation history, an Add manager relation form, and end active relation actions when allowed.

## Assignment Rules

- Only `PICKER` and `CHAMP` users can have branch assignments.
- The profile user must be `ACTIVE`.
- The branch must be `ACTIVE`.
- The branch chain must be `ACTIVE`.
- Assignment role must match the profile user's role.
- Preserve assignment history by creating new rows and ending old rows; do not overwrite historical rows.
- Branch options display chain name, branch name, order-system chain ID when available, and order-system branch ID when available.

## Manager Relation Rules

- The employee is the profile user.
- The manager selector includes valid active users only.
- Allowed pairs:
  - Picker -> Champ
  - Champ -> Area Manager
  - Area Manager -> Operations Manager or Senior Operations Manager
- Preserve relation history.
- End the old active relation before creating a replacement unless existing business rules later allow replacement.

## Branch Detail

`/admin/organization/branches/[branchId]` may show assigned Pickers and Champs with links to user profiles. It should direct admins to Workforce for assigning employees and must not become another direct assignment form surface.

## Security

Reuse existing `BranchAssignment` and `ManagerRelation` models. Do not create duplicate models.

Use explicit safe selects for user data. Do not expose `passwordHash`, session tokens, setup token hashes, or sensitive profile fields outside Admin/Super Admin screens.

## Out of Scope

- Approvals
- Notifications
- KPIs
- Imports
- Fake data
- New migrations unless the existing Phase 3 model is incomplete

## Testing Plan

- Organization page no longer renders the Assign People creation form.
- Organization page no longer renders the Manager Relations creation form.
- User detail page has Assignments and Manager Relations sections.
- Assignment form inside user profile does not include a visible User dropdown.
- Picker and Champ branch assignment rules remain valid.
- Non Picker/Champ users cannot be branch assigned.
- Inactive users cannot be branch assigned.
- Inactive branches or inactive chains cannot receive assignment.
- Manager relation role-pair validation remains enforced.
- Safe selects do not expose `passwordHash`.

## Validation

Run:

- `npm run validate`
- `npx prisma migrate status`

Runtime verification must confirm that `/admin/organization` is a clean Organization Workbench and `/admin/workforce/users/[userId]` is the employee-first assignment surface.
