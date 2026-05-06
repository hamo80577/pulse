# Pulse - Blueprint and Sitemap

## Product Summary

Pulse is an internal operations platform for managing Pickers, Champs, managers, Admins, and Super Admins across partner chains and branches.

Pulse must prioritize:

- Real organization structure.
- Server-side authorization.
- Auditability for meaningful mutations.
- Future attendance, KPI, and order imports based on stable IDs.
- English/Arabic language support.
- Light/Dark/System appearance support.

## External IDs and Source System Mapping

Pulse must not use names as primary matching keys for future imports.

Employee identifiers are planned for Phase 3 with `EmployeeProfile`:

- `shopperId`: order-system employee ID used for order and KPI files.
- `ibsId`: staffing or employment company ID used for attendance or HR-provider files.

Chain and branch identifiers are added in Phase 2.6:

- `Chain.orderSystemChainId`: order-system chain ID.
- `Branch.orderSystemBranchId`: order-system branch ID.

Future import matching rules:

- `chain id` -> `Chain.orderSystemChainId`
- `branch id` -> `Branch.orderSystemBranchId`
- `shopper id` -> `EmployeeProfile.shopperId`
- `ibs id` -> `EmployeeProfile.ibsId`

Uploaded files must later pass through a controlled import pipeline:

```text
Upload file
  -> Import batch
  -> Staging rows
  -> Validation
  -> Preview errors/warnings
  -> Commit
  -> Final attendance/KPI records
```

Phase 2.6 does not implement imports, KPI records, attendance records, `EmployeeProfile`, `shopperId`, or `ibsId`.

## Core Sitemap

Implemented or planned route families:

- `/login`
- `/first-login`
- `/access-denied`
- `/picker`
- `/champ`
- `/area-manager`
- `/workforce`
- `/operations`
- `/senior-operations`
- `/admin`
- `/super-admin`

Organization routes:

- `/admin/organization`
- `/admin/organization/tree`
- `/admin/organization/chains`
- `/admin/organization/chains/new`
- `/admin/organization/chains/[chainId]`
- `/admin/organization/branches`
- `/admin/organization/branches/new`
- `/admin/organization/branches/[branchId]`

Settings foundation routes:

- `/admin/settings`
- `/admin/settings/preferences`
- `/super-admin/settings`
- `/super-admin/settings/preferences`

Planned future route families:

- `/admin/users`
- `/admin/approvals`
- `/notifications`
- `/admin/imports`
- `/admin/reports`
- `/super-admin/settings/roles`
- `/super-admin/settings/workflows`

Do not link to planned routes until they exist.

## Language and Appearance

Pulse supports the following foundation values:

- Languages: English (`en`) and Arabic (`ar`).
- Direction: English is `ltr`; Arabic is `rtl`.
- Theme preferences: `light`, `dark`, and `system`.
- Default language: English.
- Default appearance: Light.

Preference persistence is planned for Phase 9.5. Phase 2.6 only prepares the foundation and safe placeholder settings pages.

## Phase Order

Recommended execution order:

1. Phase 0 - Project Bootstrap
2. Phase 1 - Auth, Roles, and Protected Layouts
3. Phase 2 - Organization Core
4. Phase 2.6 - External IDs, Localization, and Preferences Foundation
5. Phase 3 - User and Employee Profile Management
6. Phase 4 - Generic Approval Engine
7. Phase 5 - Annual Leave Request
8. Phase 6 - Add Picker and Onboarding
9. Phase 7 - Add Champ Request
10. Phase 8 - Transfers and Resignations
11. Phase 9 - Notification Center
12. Phase 9.5 - Settings, Language, and Appearance
13. Phase 10 - Role Dashboards and Basic Reporting
14. Phase 10.5 - Attendance and KPI Import Center
15. Phase 11 - KPI Foundation
16. Phase 12 - Hardening and Production Readiness

Phase 3 must not start until Phase 2.6 is complete.
