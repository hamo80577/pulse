# Pulse — Phase Execution Plan for Codex

## 0. Master Rule

Every phase must start with a spec file.

Codex must create:

```text
docs/specs/phase-XX-phase-name.md
```

before implementation.

No phase is considered valid if it does not have:

- Spec file
- Implementation
- Validation
- Acceptance check
- Final report

---

## 1. Phase Spec Template

Codex must use this template for every phase:

```md
# Phase XX — Phase Name

## Goal

## Current State

## Scope

## Out of Scope

## Assumptions

## Open Questions

## Data Model Changes

## Routes and Pages

## Components

## Server Actions / API Routes

## Permissions and Access Control

## Validation Rules

## Notifications

## Audit Logging

## Testing Plan

## Acceptance Criteria

## Risks and Mitigations

## Implementation Checklist
```

If there are open questions, Codex must still make reasonable assumptions and document them, unless the task is blocked.

---

## 2. Phase 0 — Project Bootstrap

### Goal

Create the base project foundation.

### Required spec

```text
docs/specs/phase-00-project-bootstrap.md
```

### Scope

- Initialize Next.js App Router project
- TypeScript
- Tailwind CSS
- Basic app shell
- shadcn/ui-style component setup
- Prisma setup
- PostgreSQL connection
- Environment variable structure
- Base folder structure
- Basic lint/typecheck/build scripts
- Root `agent.md`
- Root `docs/BLUEPRINT_SITEMAP.md`
- Root `docs/PHASES.md`

### Suggested structure

```text
app/
components/
features/
lib/
prisma/
docs/
docs/specs/
```

### Validation

- `npm run lint`
- `npm run typecheck`
- `npm run build`

### Acceptance Criteria

- Project runs locally.
- Folder structure exists.
- Prisma is configured.
- Environment variables are documented.
- No placeholder business logic pretending to be complete.
- Spec file exists.

---

## 3. Phase 1 — Auth, Roles, and Protected Layouts

### Goal

Implement secure authentication and role-based access foundations.

### Required spec

```text
docs/specs/phase-01-auth-roles-protected-layouts.md
```

### Scope

- User model
- Role enum
- User status enum
- Login page
- Logout
- Password hashing
- Session handling
- Protected dashboard layout
- Role-based redirect after login
- First-login password setup page
- Block login for suspended/on-hold/resigned users
- Super Admin seed user

### Routes

```text
/login
/first-login
/access-denied
/picker
/champ
/area-manager
/workforce
/operations
/senior-operations
/admin
/super-admin
```

### Permissions

- Only authenticated users access dashboards.
- User must be redirected to the dashboard matching their role.
- `PENDING_SETUP` users can only access `/first-login`.
- `ON_HOLD`, `SUSPENDED`, `RESIGNED`, `DELETED` cannot access system.

### Validation

- Login schema
- Password setup schema
- Strong password rules
- Server-side auth checks

### Audit Logging

- login success if desired
- login failure if practical
- password setup completed
- user status blocked login if practical

### Acceptance Criteria

- Super Admin can log in.
- User is redirected by role.
- Protected routes are inaccessible without session.
- First-login flow works.
- No plain-text password is stored.
- Spec file exists.

---

## 4. Phase 2 — Organization Core: Chains, Branches, Assignments

### Goal

Build the operational structure.

### Required spec

```text
docs/specs/phase-02-organization-core.md
```

### Scope

- Chain model
- Branch model
- BranchAssignment model
- ManagerRelation model
- Admin pages for chains
- Admin pages for branches
- Assign user to branch
- Assign manager relation
- Basic organization tree view
- Scoped query helpers

### Routes

```text
/admin/organization
/admin/organization/tree
/admin/organization/chains
/admin/organization/chains/new
/admin/organization/chains/[chainId]
/admin/organization/branches
/admin/organization/branches/new
/admin/organization/branches/[branchId]
```

### Rules

- Branch belongs to chain.
- Picker/Champ assignment must use history table.
- Do not store only one static branchId on user.
- Assignment changes must preserve old rows.
- Admin/Super Admin only for direct creation.

### Validation

- Chain name required
- Branch name required
- Branch must have valid chain
- Assignment must have valid role and branch
- Prevent duplicate active primary assignment where business rules require

### Audit Logging

- chain created/updated
- branch created/updated
- assignment created/ended
- manager relation created/ended

### Acceptance Criteria

- Admin can create chain.
- Admin can create branch under chain.
- Admin can assign picker/champ to branch.
- Organization tree displays chain -> branch -> assigned users.
- Assignment history is preserved.
- Spec file exists.

---

## 5. Phase 3 — User and Employee Profile Management

### Goal

Build controlled employee profile management.

### Required spec

```text
docs/specs/phase-03-user-employee-profile-management.md
```

### Scope

- EmployeeProfile model
- User list
- User detail
- Employee sensitive fields
- Upload metadata fields for ID card and personal photo
- Status management
- Filters by role/status/chain/branch
- Admin create user manually where permitted
- Profile access permissions

### Routes

```text
/admin/users
/admin/users/new
/admin/users/[userId]
/admin/users/[userId]/profile
/admin/users/[userId]/assignments
/admin/users/[userId]/requests
```

### Sensitive Fields

- national ID
- phone
- address
- ID card image
- personal photo

### Rules

- Sensitive fields must be protected by server-side authorization.
- Normal user deletion should not physically delete data.
- Use status transitions.
- File storage should be abstracted behind `lib/storage`.

### Validation

- name required
- role valid
- phone format
- national ID format
- unique username/email/phone/national ID according to business rules
- file type/size if upload is implemented

### Audit Logging

- profile created/updated
- user status changed
- sensitive data changed
- file metadata changed

### Acceptance Criteria

- Admin can view/filter users.
- Admin can view user details.
- Sensitive fields are not exposed to unauthorized roles.
- Status changes are audited.
- Spec file exists.

---

## 6. Phase 4 — Generic Approval Engine

### Goal

Build the reusable approval system.

### Required spec

```text
docs/specs/phase-04-generic-approval-engine.md
```

### Scope

- ApprovalRequest model
- ApprovalStep model
- Request status machine
- Step status machine
- Submit request
- Approve request
- Reject request
- Request detail page
- Approval queue page
- Approval timeline component
- Decision comment support
- Side-effect hook interface for final approval

### Routes

```text
/requests
/requests/new
/requests/[requestId]
/approvals
/approvals/[requestId]
/admin/approvals
```

### Initial Request Types

```text
ANNUAL_LEAVE
ADD_PICKER
ADD_CHAMP
TRANSFER_PICKER_SAME_CHAIN
TRANSFER_PICKER_CROSS_CHAIN
RESIGNATION
EMPLOYEE_DATA_UPDATE
```

### Rules

- Only active step approver can decide.
- Reject stops flow.
- Approve moves to next step.
- Final approval triggers completion.
- Every decision is audited.
- Current approver is notified.
- Requester is notified on final decision.

### Validation

- request type valid
- payload matches request type
- active approver validation
- rejection comment required
- no duplicate decision on same active step

### Audit Logging

- request submitted
- request approved
- request rejected
- request cancelled
- request completed

### Acceptance Criteria

- Generic approval flow works for at least one request type.
- Approval timeline shows steps.
- Request queue shows items requiring current user's decision.
- Unauthorized users cannot approve.
- Spec file exists.

---

## 7. Phase 5 — Annual Leave Request

### Goal

Implement first real request flow using the generic approval engine.

### Required spec

```text
docs/specs/phase-05-annual-leave-request.md
```

### Flow

```text
Picker -> Champ -> Area Manager -> Admin
```

### Scope

- Annual leave form
- Leave date validation
- Reason/comment
- Submit request
- Approval steps generated automatically
- Status tracking for requester
- Notifications to next approver
- Final notification to requester

### Routes

```text
/picker/requests
/picker/requests/new
/picker/requests/[requestId]
/champ/approvals
/area-manager/approvals
/admin/approvals
```

### Validation

- Leave date required
- Date cannot be invalid
- Date cannot be in the past unless Admin override exists
- Picker must have active branch assignment
- Picker must have active Champ manager relation
- Champ must have Area Manager relation

### Audit Logging

- request submitted
- each approval/rejection

### Acceptance Criteria

- Picker can submit annual leave request.
- Champ receives approval item.
- Area Manager receives item after Champ approval.
- Admin receives item after Area Manager approval.
- Picker sees final status.
- Spec file exists.

---

## 8. Phase 6 — Add Picker Request and Onboarding

### Goal

Allow Champ to request adding a new Picker and complete onboarding after approval.

### Required spec

```text
docs/specs/phase-06-add-picker-onboarding.md
```

### Flow

```text
Champ -> Area Manager -> Admin -> Picker Account Created -> First Login Setup
```

### Scope

- Add picker request form
- Required picker data
- File metadata/upload handling
- Approval flow
- Account creation after final approval
- Pending setup status
- Setup token
- Notification to requester
- First-login password setup

### Required Data

- name
- national ID
- phone
- address
- ID card image
- personal image
- branch

### Rules

- Do not create active Picker before final approval.
- Do not send reusable plain-text password.
- Create `PENDING_SETUP` user after approval.
- Generate expiring setup token.
- Picker becomes ACTIVE only after password setup.
- Create branch assignment after final approval.

### Validation

- name required
- phone required
- national ID required and unique
- branch must be in Champ scope
- file validation if upload is implemented

### Audit Logging

- request submitted
- approvals
- user created
- branch assignment created
- first login completed

### Acceptance Criteria

- Champ can submit add picker request.
- Area Manager/Admin approval works.
- Final approval creates pending picker.
- Setup flow activates picker.
- Spec file exists.

---

## 9. Phase 7 — Add Champ Request

### Goal

Allow Area Manager/Admin to request or create a Champ through approval.

### Required spec

```text
docs/specs/phase-07-add-champ-request.md
```

### Flow

```text
Area Manager -> Admin/Operations -> Champ Account Created
```

### Scope

- Add champ request form
- Champ profile fields
- Approval flow
- Account creation
- Branch assignment
- Manager relation setup
- First-login setup

### Validation

- name required
- phone required
- national ID required and unique
- target branch required
- area manager must have scope over target branch unless admin override

### Acceptance Criteria

- Area Manager can request Champ addition.
- Approval creates pending Champ account.
- Champ can complete first login.
- Champ is assigned to branch.
- Spec file exists.

---

## 10. Phase 8 — Transfers and Resignations

### Goal

Handle employee movement and exit lifecycle.

### Required spec

```text
docs/specs/phase-08-transfers-resignations.md
```

### Scope

- Same-chain transfer
- Cross-chain transfer
- Resignation request
- Hold account
- End assignment
- Create new assignment
- Transfer/resignation history

### Same Chain Flow

```text
Requester -> Area Manager -> Admin
```

### Cross Chain Flow

```text
Requester -> Current Area Manager -> Target Area Manager -> Admin
```

### Resignation Flow

```text
Manager/Requester -> Area Manager/Admin -> User On Hold/Resigned
```

### Rules

- Transfer must end old assignment and create a new one.
- Do not overwrite historical assignment.
- Resignation disables login.
- Resigned user remains in history.
- Cross-chain transfer must require both area approvals.

### Validation

- source branch exists
- target branch exists
- source and target cannot be same
- same-chain vs cross-chain must be detected
- target area manager must exist for cross-chain flow

### Acceptance Criteria

- Same-chain transfer works.
- Cross-chain transfer works.
- Resignation changes status and ends assignment.
- History is preserved.
- Spec file exists.

---

## 11. Phase 9 — Notification Center

### Goal

Build full notification center.

### Required spec

```text
docs/specs/phase-09-notification-center.md
```

### Scope

- Notification model if not already complete
- Notification bell
- Unread count
- Notification list
- Mark as read
- Mark all as read
- Link notifications to requests/users/entities
- Notification creation helper

### Routes

```text
/notifications
```

Role-specific shell may show the same notification center with scoped data.

### Notification Events

- request submitted
- approval required
- request approved
- request rejected
- request completed
- user created
- setup required
- transfer completed
- resignation completed

### Acceptance Criteria

- User sees own notifications.
- Unread count works.
- Clicking notification opens related page.
- Mark as read works.
- Spec file exists.

---

## 12. Phase 10 — Role Dashboards and Basic Reporting

### Goal

Create useful role dashboards before advanced KPI integration.

### Required spec

```text
docs/specs/phase-10-role-dashboards-basic-reporting.md
```

### Scope

- Picker dashboard
- Champ dashboard
- Area Manager dashboard
- Admin dashboard
- Super Admin dashboard
- Basic counts and operational summaries
- Empty KPI placeholders where KPI definitions are missing

### Do Not Fake KPIs

If KPI definitions are not provided, show placeholders or basic counts only.

### Dashboard Examples

Picker:

- current branch
- manager
- active requests
- latest notifications

Champ:

- assigned branch
- active pickers
- pending approvals
- recent requests

Area Manager:

- branches in scope
- champs in scope
- pending approvals
- transfer requests

Admin:

- total users
- pending setup
- pending approvals
- recent audit logs

Super Admin:

- global counts
- system health placeholders
- approval queue summary

### Acceptance Criteria

- Each role has a dashboard.
- Data is scoped correctly.
- No unauthorized data leakage.
- Spec file exists.

---

## 13. Phase 11 — KPI Foundation

### Goal

Prepare KPI structure without overcommitting to undefined metrics.

### Required spec

```text
docs/specs/phase-11-kpi-foundation.md
```

### Scope

- KPI data model
- Metric definition registry
- Daily snapshot table design
- Branch ranking design
- Import/source abstraction
- Date filters
- Basic chart components

### Important

Do not invent business KPIs without user approval.

### Possible Tables

- pickerPerformanceDaily
- branchPerformanceDaily
- chainPerformanceDaily
- rankingSnapshots
- metricDefinitions

### Acceptance Criteria

- KPI schema can support picker/branch/chain metrics.
- Dashboard components can consume KPI data.
- No fake business logic.
- Spec file exists.

---

## 14. Phase 12 — Hardening, Security, and Production Readiness

### Goal

Prepare for real production usage.

### Required spec

```text
docs/specs/phase-12-hardening-production-readiness.md
```

### Scope

- Permission review
- Audit review
- Sensitive data review
- File access review
- Error handling
- Loading states
- Empty states
- Backup notes
- Environment setup docs
- Deployment docs
- Database indexes
- Rate limiting where appropriate
- Session security
- Logging

### Validation

- full build
- lint
- typecheck
- permission test review
- seed data review
- migration review

### Acceptance Criteria

- Production env documented.
- Sensitive data routes protected.
- Critical mutations audited.
- Build passes.
- Known risks documented.
- Spec file exists.

---

## 15. Prompt Template for Each Codex Phase

Use this prompt when asking Codex to execute a phase:

```text
You are working on the Pulse project.

Before writing any implementation code, read agent.md, docs/BLUEPRINT_SITEMAP.md, docs/PHASES.md, package.json, the app structure, existing Prisma schema/migrations, auth files, validation files, and any relevant feature modules.

Task: Execute Phase XX — [PHASE NAME].

Mandatory process:
1. Inspect the current codebase and confirm what already exists.
2. Create docs/specs/phase-XX-[phase-name].md before implementation.
3. The spec must include: goal, current state, scope, out of scope, data model changes, routes/pages, components, server actions/APIs, permissions, validation, notifications, audit logging, testing plan, acceptance criteria, risks, and implementation checklist.
4. Do not implement anything until the spec file exists.
5. Implement the phase according to the spec.
6. Add server-side authorization. UI hiding is not enough.
7. Add validation for every mutation.
8. Add audit logging for critical mutations.
9. Add notifications where this phase requires them.
10. Run validation: lint, typecheck, build, and tests if available.
11. Fix any issues found.
12. Report changed files, validation results, known gaps, and whether the acceptance criteria are fully met.

Important:
- Do not fake KPI logic.
- Do not store plain-text passwords.
- Do not send reusable passwords.
- Do not delete business history.
- Preserve assignment history.
- Keep the architecture modular and scalable.
```

---

## 16. Recommended Execution Order

Run phases in this order:

1. Phase 0 — Project Bootstrap
2. Phase 1 — Auth, Roles, and Protected Layouts
3. Phase 2 — Organization Core
4. Phase 3 — User and Employee Profile Management
5. Phase 4 — Generic Approval Engine
6. Phase 5 — Annual Leave Request
7. Phase 6 — Add Picker and Onboarding
8. Phase 7 — Add Champ Request
9. Phase 8 — Transfers and Resignations
10. Phase 9 — Notification Center
11. Phase 10 — Role Dashboards and Basic Reporting
12. Phase 11 — KPI Foundation
13. Phase 12 — Hardening and Production Readiness

Do not skip directly to dashboards before the organization, auth, and approval engine are stable.
