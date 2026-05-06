# Phase 4 - Generic Approval Engine

## Goal

Build a reusable request and approval engine that supports request-type-driven workflows, step-based approval decisions, audit logging, and minimal notification creation without implementing any Phase 5-8 lifecycle side effects.

## Current State

- Phase 0, Phase 1, Phase 2, Phase 2.6, and Phase 3 are complete.
- Auth, role routing, protected dashboard layouts, audit logs, organization structure, employee profiles, and Admin/Super Admin ERP shell routes exist.
- Admin navigation contains Requests, Approvals, and Notifications entries, but they are marked as coming soon.
- There is no `features/approvals` module.
- There are no `ApprovalRequest`, `ApprovalStep`, or `Notification` tables.
- There is no generic status machine for request submission, approval, rejection, cancellation, or completion.

## Scope

- Add generic approval request and approval step Prisma models.
- Add a minimal notification table and helper needed by approval events.
- Add request, step, decision, and notification enums.
- Add workflow templates for initial request types:
  - `ANNUAL_LEAVE`
  - `ADD_PICKER`
  - `ADD_CHAMP`
  - `TRANSFER_PICKER_SAME_CHAIN`
  - `TRANSFER_PICKER_CROSS_CHAIN`
  - `RESIGNATION`
  - `EMPLOYEE_DATA_UPDATE`
- Implement status-machine helpers for submit, approve, reject, cancel, and complete transitions.
- Implement request creation for at least one request type, using `ANNUAL_LEAVE` as the first generic proof.
- Implement decision actions with rejection comments required.
- Add approval queue and request detail queries with explicit safe selects.
- Add protected routes for:
  - `/requests`
  - `/requests/new`
  - `/requests/[requestId]`
  - `/approvals`
  - `/approvals/[requestId]`
  - `/admin/approvals`
- Add approval list, request form, request detail, timeline, and decision panel components.
- Add audit logs for request submission and decisions.
- Add minimal notifications for next approver and final requester decision.

## Out of Scope

- Annual leave business-specific rules from Phase 5.
- Add Picker or Add Champ account creation side effects from Phases 6 and 7.
- Transfer, resignation, status, branch assignment, or manager relation side effects from Phase 8.
- Full notification center UI, unread counters, mark-as-read actions, or notification preferences from Phase 9.
- Approval workflow builder/settings UI.
- KPI, attendance, imports, reports, or fake operational data.
- File uploads or attachment storage.
- Admin overrides beyond normal active-step decisions.

## Assumptions

- Phase 4 proves the generic engine with `ANNUAL_LEAVE`; future phases add request-specific payload validation and side effects.
- A request can be created by any active authenticated user.
- Initial workflow templates are static code definitions, not database-configurable workflows.
- Admin and Super Admin can view `/admin/approvals` as an operational queue.
- Step approver matching uses either direct `approverUserId` when present or `approverRole` when role-based.
- Role-based approver steps are usable even before scoped manager resolution is implemented in later request phases.

## Open Questions

- None blocking. Workflow customization, scope-aware approver resolution, and notification center behavior are deferred to later phases.

## Data Model Changes

Add enums:

- `ApprovalRequestType`
- `ApprovalRequestStatus`
- `ApprovalStepStatus`
- `ApprovalDecision`
- `NotificationType`

Add model `ApprovalRequest`:

- `id`
- `requestType`
- `requesterId`
- `targetUserId`
- `status`
- `currentStepOrder`
- `payloadJson`
- `createdAt`
- `updatedAt`
- `submittedAt`
- `finalDecisionAt`
- requester and target user relations
- steps relation

Add model `ApprovalStep`:

- `id`
- `requestId`
- `stepOrder`
- `approverRole`
- `approverUserId`
- `status`
- `decision`
- `comment`
- `decidedAt`
- `createdAt`
- `updatedAt`
- request and approver relations

Add model `Notification`:

- `id`
- `userId`
- `title`
- `body`
- `type`
- `linkUrl`
- `isRead`
- `readAt`
- `createdAt`
- user relation

Indexes:

- Approval requests by requester, target user, status, type, and created date.
- Approval steps by request, status, approver role, approver user, and step order.
- Notifications by user, read state, type, and created date.

## Routes and Pages

Add:

- `/requests` - current user's submitted requests.
- `/requests/new` - create a generic proof request.
- `/requests/[requestId]` - request detail and timeline for requester, involved target, approver, Admin, or Super Admin.
- `/approvals` - current user's active approval queue.
- `/approvals/[requestId]` - approval detail and decision panel for active approvers.
- `/admin/approvals` - Admin/Super Admin operational approval queue.

Keep role dashboards unchanged except for navigation links.

## Components

Create components under `features/approvals/components/`:

- `request-form.tsx`
- `request-list.tsx`
- `approval-queue.tsx`
- `request-detail.tsx`
- `approval-timeline.tsx`
- `decision-panel.tsx`
- `action-message.tsx`

Use existing UI primitives and ERP layout. Keep the experience dense, clear, and internal-tool oriented.

## Server Actions / API Routes

Add server actions under `features/approvals/actions.ts`:

- `createApprovalRequestAction`
- `approveRequestAction`
- `rejectRequestAction`
- `cancelRequestAction`

No API routes are required.

## Permissions and Access Control

- All approval routes require an authenticated active session.
- A requester can view their own requests.
- A target user can view requests targeting them.
- An active step approver can view and decide their active queue items.
- Admin and Super Admin can view all requests and queues.
- Only the active step approver can approve or reject.
- Rejection requires a non-empty comment.
- Server actions enforce authorization; UI hiding is not authorization.

## Validation Rules

- `requestType` must be valid.
- `payloadJson` must be object-shaped and request-type compatible.
- `ANNUAL_LEAVE` proof payload requires a valid leave date and reason.
- Reject invalid dates.
- Decision comments are optional on approval and required on rejection.
- Do not allow decisions on non-active steps.
- Do not allow duplicate decisions on the same active step.
- Do not allow cancelling requests after final approval or rejection.

## Notifications

Create minimal notification records for:

- request submitted and awaiting first approver
- request approved at a step and awaiting next approver
- request fully approved
- request rejected
- request cancelled

Full notification center UI and read-management remain Phase 9.

## Audit Logging

Create audit logs for:

- `APPROVAL_REQUEST_SUBMITTED`
- `APPROVAL_REQUEST_APPROVED`
- `APPROVAL_REQUEST_REJECTED`
- `APPROVAL_REQUEST_CANCELLED`
- `APPROVAL_REQUEST_COMPLETED`

Audit payloads must not include passwords, password hashes, session tokens, setup token hashes, or sensitive profile data unless the request payload explicitly requires a future phase to handle it with scoped access.

## Testing Plan

- Schema tests for approval and notification models/enums.
- Workflow template tests for initial request types and ordered steps.
- Status-machine tests for approval, rejection, completion, cancellation, and invalid duplicate decisions.
- Validation tests for request creation and rejection comments.
- Permission tests for active approver decisions and admin queue access.
- Query security tests verifying explicit safe selects and no unsafe `user: true`.
- Route tests for requests and approvals pages.
- Component/static tests verifying timeline and decision panel exist.
- Run `npm run lint`.
- Run `npm test`.
- Run `npm run typecheck`.
- Run `npm run prisma:validate`.
- Run `npm run build`.
- Run `npx prisma migrate status`.

## Acceptance Criteria

- Spec exists before implementation.
- Migration adds approval request, approval step, and minimal notification tables.
- Generic request creation works for at least `ANNUAL_LEAVE`.
- Request creation creates ordered approval steps from a reusable workflow template.
- Current approvers can see active queue items.
- Active approvers can approve a step.
- Approval advances to the next step or completes the request when the final step is approved.
- Active approvers can reject with a required comment, stopping the flow.
- Unauthorized users cannot approve, reject, or see unrelated requests.
- Request detail shows payload summary and approval timeline.
- Admin/Super Admin can view `/admin/approvals`.
- Approval decisions create audit logs.
- Approval events create minimal notification records.
- No Phase 5-8 side effects are implemented.
- No KPI, import center, lifecycle flow, file upload, fake performance data, or approval settings builder is implemented.
- Required validation commands pass.

## Risks and Mitigations

- **Scope creep into request-specific flows:** Phase 4 only stores payloads and proves the generic engine.
- **Unauthorized decisions:** centralize active-step authorization and test it directly.
- **Sensitive payload leakage:** use safe selects and keep Phase 4 proof payload non-sensitive.
- **Workflow rigidity:** keep templates in a small module so future DB-configured workflows can replace them.
- **Notification overbuild:** create notification records only; defer full notification center to Phase 9.

## Implementation Checklist

- [ ] Add failing Phase 4 tests first.
- [ ] Add Prisma enums/models and migration.
- [ ] Add approval workflow templates, validation, permission, and transition helpers.
- [ ] Add notification helper.
- [ ] Add approval queries with safe selects.
- [ ] Add approval server actions with audit logging and notification creation.
- [ ] Add request and approval components.
- [ ] Add routes for requests, approvals, and admin approvals.
- [ ] Update navigation links for Requests and Approvals.
- [ ] Run full validation and migration status.
- [ ] Perform browser verification for the new approval pages.
