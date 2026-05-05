# agent.md — Plus Project Codex Operating Guide

## 0. Project Identity

Project name: **Plus**

Plus is an internal operations web application for managing, tracking, and controlling the workforce structure around **Pickers** and **Champs** across partner chains and branches.

Domain definitions:

- **Picker**: the person who prepares orders inside partner branches.
- **Champ**: the direct manager responsible for pickers and their daily work.
- **Area Manager**: manager responsible for a group of branches/champs.
- **Admin**: operational administrator who handles user creation, approvals, and controlled operational changes.
- **Super Admin**: full system owner with unrestricted visibility and override capability.

Approximate starting scale:

- 500 Pickers
- 90 Champs
- 5 Area Managers
- 1 Workforce Manager
- 1 Operations Manager
- 1 Senior Operations Manager
- Admin users
- 1 Super Admin

The system must be built as a serious internal operations platform, not a decorative dashboard.

---

## 1. Recommended Stack

Use this stack unless the user explicitly changes it:

- **Framework**: Next.js App Router
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Auth.js / NextAuth-style auth, or a secure custom credentials flow if required
- **UI**: Tailwind CSS + shadcn/ui-style reusable components
- **Forms**: React Hook Form + Zod
- **Validation**: Zod on both client-facing forms and server actions/API boundaries
- **Tables**: TanStack Table
- **Charts**: Recharts or Tremor-style dashboard components
- **File storage**: S3-compatible storage such as Cloudflare R2, not database blobs
- **Deployment target**: VPS-compatible Node.js deployment with PostgreSQL and object storage

Architecture style:

- Start as a **modular monolith**.
- Keep domains separated inside the codebase.
- Do not prematurely split into microservices.
- Design database relations in a way that supports future scaling and reporting.

---

## 2. Absolute Non-Negotiables

Codex must follow these rules strictly:

1. **Spec-first execution is mandatory.**
   - Before implementing any phase or large feature, create a phase spec file under `docs/specs/`.
   - Do not start implementation before the spec exists.
   - The spec must include scope, data model impact, routes/pages, components, server actions/APIs, validation, tests, acceptance criteria, and risks.

2. **No fake completion.**
   - Do not mark a phase complete unless acceptance criteria are implemented and validated.
   - If something is missing, state it clearly.

3. **Security-first handling of personal data.**
   - National ID, phone, address, ID card images, and personal photos are sensitive.
   - Never expose sensitive data to unauthorized roles.
   - Never store plain-text passwords.
   - Never send a reusable plain-text password through the UI or logs.

4. **No direct password sharing.**
   - New users must receive either a temporary one-time setup token or must be forced to change password on first login.
   - Temporary credentials must expire.
   - Passwords must be hashed using a strong async hashing algorithm.

5. **Every meaningful mutation must be auditable.**
   - Creating/updating users
   - Changing assignments
   - Approving/rejecting requests
   - Suspending/holding/resigning users
   - Changing chains/branches
   - Overriding workflow
   - Permission changes

6. **Authorization must be enforced server-side.**
   - Do not rely on hiding UI controls only.
   - Every server action/API route must validate the current user's role and scope.

7. **Do not delete business history.**
   - Transfers, resignations, branch changes, and manager changes must preserve history.
   - Use status fields and end dates instead of destructive deletion.

8. **Generic approval engine first.**
   - Do not hardcode every approval flow as a separate one-off implementation.
   - Approval should be request-type-driven and step-driven.

9. **Validation everywhere.**
   - Use Zod or equivalent validation for request payloads.
   - Validate IDs, role transitions, dates, file constraints, and approval permissions.

10. **Keep UI in English by default unless asked otherwise.**
    - The user may discuss the product in Arabic, but product UI labels should default to professional English.

---

## 3. Codex Working Protocol

For every phase or major task, Codex must do the following in order:

### Step 1 — Inspect

Read relevant files before making changes.

Minimum inspection checklist:

- package.json
- app directory structure
- existing auth files
- existing database schema/migrations
- existing components
- existing server actions/API routes
- existing validation schemas
- existing docs/specs
- agent.md

### Step 2 — Confirm Existing State

Before patching, state:

- What exists
- What is missing
- What is broken
- Which files are relevant
- Whether the requested issue is actually present

### Step 3 — Create Spec File

Create a spec file using this naming format:

```text
docs/specs/phase-XX-short-name.md
```

The spec must include:

```md
# Phase XX — Name

## Goal
## Current State
## Scope
## Out of Scope
## Data Model Changes
## Routes and Pages
## Components
## Server Actions / APIs
## Permissions and Access Control
## Validation Rules
## Notifications
## Audit Logging
## Testing Plan
## Acceptance Criteria
## Risks and Mitigations
## Implementation Checklist
```

### Step 4 — Implement

Only after the spec exists, implement the phase.

### Step 5 — Validate

Run appropriate checks:

- typecheck
- lint
- build
- tests if available
- migration validation
- manual route review where possible

If any command fails, fix the issue or clearly document why it cannot be fixed.

### Step 6 — Report

Final report must include:

- Files changed
- What was implemented
- Validation results
- Known gaps
- Next recommended step

---

## 4. Product Principles

Plus must optimize for:

- Operational clarity
- Controlled approvals
- Traceability
- Permission correctness
- Simple daily usage
- Fast manager decision-making
- Future KPI expansion
- Clean org structure

Avoid:

- Decorative dashboards without business logic
- Hardcoded role assumptions everywhere
- Duplicated approval logic
- Flat employee tables that cannot track movement history
- Deleting employees instead of changing lifecycle status
- Unscoped admin queries that leak data across roles

---

## 5. Core Roles

Use these role keys:

```ts
type Role =
  | "PICKER"
  | "CHAMP"
  | "AREA_MANAGER"
  | "WORKFORCE_MANAGER"
  | "OPERATIONS_MANAGER"
  | "SENIOR_OPERATIONS_MANAGER"
  | "ADMIN"
  | "SUPER_ADMIN";
```

Role hierarchy for global authority:

```text
SUPER_ADMIN
ADMIN
SENIOR_OPERATIONS_MANAGER
OPERATIONS_MANAGER
WORKFORCE_MANAGER
AREA_MANAGER
CHAMP
PICKER
```

Important: hierarchy does not automatically mean all access is global. Scope matters.

Example:

- Area Manager sees only assigned chains/branches.
- Champ sees only assigned branch pickers.
- Picker sees only self and allowed branch-level metrics.
- Admin sees operational admin scope.
- Super Admin sees all.

---

## 6. Organization Model

The organization structure is:

```text
Company
  -> Chain
      -> Branch
          -> Champ assignment(s)
          -> Picker assignment(s)
```

Rules:

1. Chain can have many branches.
2. Branch belongs to one chain.
3. Picker is assigned to a branch through an assignment history table.
4. Champ is assigned to a branch through an assignment history table.
5. A branch can have one or more Champs if business requires.
6. Assignment changes must preserve old history with start/end dates.
7. Manager relationships must be explicit and historical.

---

## 7. Core Database Entities

Recommended initial entities:

### User

Represents login identity.

Fields:

- id
- name
- username
- email
- phone
- role
- status
- passwordHash
- mustChangePassword
- lastLoginAt
- createdAt
- updatedAt

Statuses:

```ts
"ACTIVE" | "PENDING_SETUP" | "ON_HOLD" | "SUSPENDED" | "RESIGNED" | "DELETED"
```

Do not physically delete normal employees in business flows.

### EmployeeProfile

Stores sensitive employee details.

Fields:

- id
- userId
- nationalId
- address
- personalPhotoUrl
- idCardFrontUrl
- idCardBackUrl
- hireDate
- employmentStatus
- createdAt
- updatedAt

### Chain

Fields:

- id
- name
- code
- status
- createdAt
- updatedAt

### Branch

Fields:

- id
- chainId
- name
- code
- address
- status
- createdAt
- updatedAt

### BranchAssignment

Fields:

- id
- userId
- branchId
- roleAtBranch
- startDate
- endDate
- isPrimary
- status
- createdById
- createdAt
- updatedAt

### ManagerRelation

Fields:

- id
- employeeUserId
- managerUserId
- relationType
- startDate
- endDate
- status
- createdAt
- updatedAt

### ApprovalRequest

Fields:

- id
- requestType
- requesterId
- targetUserId
- status
- currentStepOrder
- payloadJson
- createdAt
- updatedAt
- finalDecisionAt

### ApprovalStep

Fields:

- id
- requestId
- stepOrder
- approverRole
- approverUserId
- status
- decision
- comment
- decidedAt
- createdAt
- updatedAt

### Notification

Fields:

- id
- userId
- title
- body
- type
- linkUrl
- isRead
- readAt
- createdAt

### AuditLog

Fields:

- id
- actorUserId
- action
- entityType
- entityId
- oldValueJson
- newValueJson
- ipAddress
- userAgent
- createdAt

### KPI Tables

Do not overbuild KPIs in early phases. Prepare schema later when KPI definitions are clear.

Possible future tables:

- pickerPerformanceDaily
- branchPerformanceDaily
- chainPerformanceDaily
- rankingSnapshots

---

## 8. Approval Engine Rules

Approval must be generic.

A request has:

- type
- requester
- optional target employee
- payload
- status
- current step
- steps
- history
- comments

Approval statuses:

```ts
"DRAFT"
"SUBMITTED"
"PENDING"
"APPROVED"
"REJECTED"
"CANCELLED"
"EXPIRED"
```

Step statuses:

```ts
"WAITING"
"ACTIVE"
"APPROVED"
"REJECTED"
"SKIPPED"
```

Initial request types:

```ts
"ANNUAL_LEAVE"
"ADD_PICKER"
"ADD_CHAMP"
"TRANSFER_PICKER_SAME_CHAIN"
"TRANSFER_PICKER_CROSS_CHAIN"
"RESIGNATION"
"EMPLOYEE_DATA_UPDATE"
```

Flow examples:

### Annual Leave

```text
Picker -> Champ -> Area Manager -> Admin
```

### Add Picker

```text
Champ -> Area Manager -> Admin -> User Created
```

### Add Champ

```text
Area Manager -> Operations/Admin -> User Created
```

### Same Chain Transfer

```text
Requester -> Area Manager -> Admin
```

### Cross Chain Transfer

```text
Requester -> Current Area Manager -> Target Area Manager -> Admin
```

### Resignation

```text
Requester/Manager -> Area Manager/Admin -> User On Hold/Resigned
```

Rules:

1. Only the active step approver can approve/reject.
2. Each decision must create an audit log.
3. Moving to the next step must notify the next approver.
4. Final approval may trigger side effects such as user creation, branch transfer, or account hold.
5. Rejection must stop the flow.
6. Request history must remain visible to authorized users.

---

## 9. Notification Rules

Create notifications for:

- New request submitted
- Request needs approval
- Request approved
- Request rejected
- Request completed
- New user created
- First login setup required
- Transfer completed
- Resignation/hold completed
- Admin override

Notification center must support:

- unread count
- mark as read
- mark all as read
- link to related entity/request
- filtering by read/unread/type

---

## 10. Authentication and Access

Required features:

- Login
- Logout
- First login password setup
- Forced password reset when `mustChangePassword = true`
- Session handling
- Protected routes
- Role-based redirect after login
- Account status enforcement

Rules:

- `ON_HOLD`, `SUSPENDED`, `RESIGNED`, and `DELETED` users cannot log in.
- `PENDING_SETUP` users can only access password setup.
- All protected pages must validate session server-side.
- All mutations must validate role and scope server-side.

---

## 11. File Upload Rules

Sensitive files:

- ID card image
- Personal photo

Rules:

1. Store files in object storage, not the database.
2. Save only file metadata/URL/key in database.
3. Validate file type and size.
4. Restrict access by role and scope.
5. Do not expose raw storage URLs if they are public.
6. Prefer signed URLs or controlled download routes.
7. Audit access to highly sensitive files if practical.

---

## 12. Suggested Repository Structure

Use a structure close to this:

```text
app/
  (auth)/
    login/
    first-login/
  (dashboard)/
    picker/
    champ/
    area-manager/
    workforce/
    operations/
    senior-operations/
    admin/
    super-admin/
  api/
components/
  layout/
  ui/
  forms/
  tables/
  dashboards/
features/
  auth/
  users/
  organization/
  approvals/
  notifications/
  audit/
  kpis/
lib/
  auth/
  db/
  permissions/
  validation/
  storage/
  audit/
  notifications/
prisma/
  schema.prisma
  migrations/
docs/
  specs/
  BLUEPRINT_SITEMAP.md
  PHASES.md
agent.md
```

Feature module pattern:

```text
features/approvals/
  actions.ts
  queries.ts
  schemas.ts
  permissions.ts
  types.ts
  components/
```

Do not dump all logic into app routes or random utility files.

---

## 13. UI Guidelines

Design direction:

- Clean internal operations dashboard
- Light theme
- Professional layout
- Clear tables
- Strong status badges
- Minimal decorative noise
- Fast actions for managers
- Responsive but desktop-first

Common components:

- App shell
- Sidebar
- Topbar
- Role badge
- Notification bell
- Data table
- Status badge
- Approval timeline
- Request detail panel
- Employee profile card
- Organization tree
- Confirm dialog
- Empty state
- Error state

Status colors should be consistent:

- Approved: green
- Pending: amber
- Rejected: red
- On Hold/Suspended: gray/red
- Active: green
- Draft: gray

---

## 14. Validation Standards

All forms must have schema validation.

Examples:

- National ID: required, exact business length if known, numeric string
- Phone: required, normalized
- Name: required, length constraints
- Date: valid date, cannot be invalid range
- Leave date: cannot be in the past unless admin override
- Transfer: source and target branch cannot be the same
- Add picker: national ID and phone should be unique if business requires
- File upload: type/size constraints
- Approval decision: comment required on rejection

---

## 15. Testing and Quality Gates

For every phase:

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

If the project uses tests:

```bash
npm test
```

Recommended tests:

- permission checks
- approval flow transitions
- user status login restrictions
- assignment history
- notification creation
- validation schemas

Do not skip validation just because UI works.

---

## 16. Acceptance Definition

A phase is complete only when:

1. Spec file exists.
2. Database/schema changes are implemented.
3. UI routes/pages are implemented.
4. Server-side authorization exists.
5. Validation exists.
6. Audit logging exists for mutations.
7. Notifications exist where relevant.
8. Typecheck passes.
9. Build passes.
10. Known gaps are documented.

---

## 17. Codex Response Style

When reporting back, use this format:

```md
## Summary
## Files Changed
## Implementation Details
## Validation Results
## Known Gaps
## Next Step
```

Be direct. Do not hide incomplete work.

---

## 18. Current Priority

The correct build order is:

1. Foundation and auth
2. Organization tree
3. User and assignment management
4. Generic approval engine
5. Notifications
6. Employee lifecycle flows
7. KPI dashboards
8. Reporting and hardening

Do not start with KPI dashboards before roles, org scope, and approval engine are stable.
