# Plus — Blueprint and Sitemap

## 1. Product Summary

**Plus** is an internal operations web application that manages the workforce structure of Pickers and Champs across partner chains and branches.

It combines:

- Role-based portals
- Organization tree
- Employee profile management
- Approval workflows
- Notifications
- Audit logs
- Future KPI dashboards and rankings

The platform must support operational control, approval governance, and clear visibility for all levels of the operations hierarchy.

---

## 2. Main Personas

### Picker

A Picker prepares orders in partner branches.

Primary needs:

- View personal performance
- View branch performance
- View branch ranking
- Submit requests
- Track request status
- Receive notifications

### Champ

A Champ manages pickers in a branch.

Primary needs:

- View assigned branch
- View assigned pickers
- Submit new picker requests
- Approve picker requests
- Start transfer/resignation flows
- Receive approvals and lifecycle notifications

### Area Manager

An Area Manager manages branches/champs in a defined scope.

Primary needs:

- See branch/champ performance
- Approve champ and picker requests
- Manage transfer approvals
- Request new champ addition
- See operational exceptions

### Workforce Manager

Primary needs:

- See aggregated workforce view
- Track staffing coverage
- Monitor pending operational requests
- Review branch/team status

### Operations Manager

Primary needs:

- See operations-level dashboards
- Review area performance
- Monitor request volume and aging
- Escalate or override selected workflows if permitted

### Senior Operations Manager

Primary needs:

- Executive operations dashboard
- Chain/area/branch visibility
- High-level trends
- Governance and compliance visibility

### Admin

Primary needs:

- Create and manage users
- Create chains and branches
- Manage assignments
- Finalize approvals
- Manage account status
- Review logs
- Handle controlled operational updates

### Super Admin

Primary needs:

- Full system access
- Configure roles and workflows
- View all data
- Override workflows
- Manage system settings
- Review audit and security logs

---

## 3. Core Product Modules

### 3.1 Authentication Module

Purpose:

- Secure login
- Role-based routing
- First-login password setup
- Account status enforcement

Pages:

- `/login`
- `/first-login`
- `/forgot-password`
- `/access-denied`

Core rules:

- Inactive users cannot log in.
- New users must reset password or complete setup.
- Protected pages require a valid session.
- Users are redirected to their role dashboard after login.

---

### 3.2 Role-Based Dashboard Module

Purpose:

Show each role a dashboard designed for its responsibilities.

Dashboards:

- `/picker`
- `/champ`
- `/area-manager`
- `/workforce`
- `/operations`
- `/senior-operations`
- `/admin`
- `/super-admin`

Rules:

- Do not use one generic dashboard for all roles.
- Share components where possible, but route data must be role-scoped.
- Server-side authorization is mandatory.

---

### 3.3 Organization Module

Purpose:

Manage the structure:

```text
Chain -> Branch -> Champs/Pickers
```

Core features:

- Create chain
- Edit chain
- Archive/deactivate chain
- Create branch under chain
- Edit branch
- Archive/deactivate branch
- Assign picker to branch
- Assign champ to branch
- View organization tree
- View branch staffing
- View employee assignment history

Pages:

- `/admin/organization`
- `/admin/organization/chains`
- `/admin/organization/chains/new`
- `/admin/organization/chains/[chainId]`
- `/admin/organization/branches/new`
- `/admin/organization/branches/[branchId]`
- `/admin/organization/tree`
- `/super-admin/organization`

---

### 3.4 User Management Module

Purpose:

Manage users and profiles.

Core features:

- View users
- Filter by role/status/chain/branch
- Create admin-level users
- View employee profile
- Edit controlled fields
- Suspend/hold user
- Reset setup token
- View assignment history
- View request history

Pages:

- `/admin/users`
- `/admin/users/new`
- `/admin/users/[userId]`
- `/admin/users/[userId]/profile`
- `/admin/users/[userId]/assignments`
- `/admin/users/[userId]/requests`
- `/super-admin/users`
- `/super-admin/users/[userId]`

Sensitive fields:

- national ID
- address
- phone
- ID card image
- personal photo

Access to sensitive fields must be scoped.

---

### 3.5 Approval Module

Purpose:

Generic approval engine for controlled requests.

Initial request types:

- Annual leave
- Add picker
- Add champ
- Same-chain picker transfer
- Cross-chain picker transfer
- Resignation
- Employee data update

Pages:

- `/requests`
- `/requests/new`
- `/requests/[requestId]`
- `/approvals`
- `/approvals/[requestId]`
- `/admin/approvals`
- `/admin/approval-settings`
- `/super-admin/approval-settings`

Core screens:

- Request list
- Request detail
- Approval timeline
- Decision panel
- Comment history
- Attachments section
- Request payload summary

Rules:

- Every request has steps.
- Every decision has an audit log.
- Rejection comments are required.
- Requester can track status.
- Current approver receives notification.
- Final approval can trigger side effects.

---

### 3.6 Notification Module

Purpose:

Central notification system.

Core features:

- Notification bell
- Notification center
- Read/unread status
- Linked notifications
- Type filtering
- Mark one/all as read

Pages:

- `/notifications`
- `/notifications/[notificationId]` if needed

Notification types:

- request submitted
- approval required
- request approved
- request rejected
- user created
- password setup required
- transfer completed
- resignation completed
- admin override
- system alert

---

### 3.7 Employee Lifecycle Module

Purpose:

Manage real operational lifecycle.

Flows:

1. Add Picker
2. Add Champ
3. First login setup
4. Transfer
5. Resignation
6. Hold/Suspend
7. Reactivation if allowed

Pages:

- `/champ/pickers/new-request`
- `/area-manager/champs/new-request`
- `/admin/lifecycle`
- `/admin/lifecycle/transfers`
- `/admin/lifecycle/resignations`

Rules:

- New picker/champ creation should come from approved request flow where applicable.
- Transfer must preserve old assignment history.
- Resignation/hold must not delete user.
- First login must force password setup.

---

### 3.8 KPI and Performance Module

Purpose:

Show performance after core structure is stable.

Do not implement early unless KPI definitions are provided.

Possible screens:

- Picker personal performance
- Branch performance
- Branch ranking
- Champ team performance
- Area dashboard
- Chain dashboard
- Operations dashboard

Pages:

- `/picker/performance`
- `/picker/branch`
- `/picker/ranking`
- `/champ/performance`
- `/area-manager/performance`
- `/operations/performance`
- `/senior-operations/performance`
- `/admin/reports`

Future KPI ideas:

- Prepared orders
- Productivity
- Attendance
- Late orders
- Availability
- Active time
- Branch rank
- Picker rank
- Error rate
- Compliance metrics

---

### 3.9 Audit Log Module

Purpose:

Trace all critical actions.

Pages:

- `/admin/audit-logs`
- `/super-admin/audit-logs`

Log:

- actor
- action
- entity type
- entity id
- old values
- new values
- timestamp
- IP/user agent if available

Critical actions:

- user created
- user updated
- user status changed
- branch assignment changed
- manager relation changed
- request submitted
- request approved/rejected
- workflow overridden
- sensitive file uploaded/accessed if practical

---

### 3.10 Settings Module

Purpose:

Configure global system settings.

Pages:

- `/super-admin/settings`
- `/super-admin/settings/roles`
- `/super-admin/settings/workflows`
- `/super-admin/settings/security`

Settings:

- role permissions
- approval workflow definitions
- notification preferences
- security settings
- file upload limits
- account setup token expiry
- session rules

---

## 4. Sitemap

```text
/
├── /login
├── /first-login
├── /forgot-password
├── /access-denied
│
├── /picker
│   ├── /picker/performance
│   ├── /picker/branch
│   ├── /picker/ranking
│   ├── /picker/requests
│   ├── /picker/requests/new
│   ├── /picker/requests/[requestId]
│   ├── /picker/notifications
│   └── /picker/profile
│
├── /champ
│   ├── /champ/dashboard
│   ├── /champ/branch
│   ├── /champ/pickers
│   ├── /champ/pickers/[pickerId]
│   ├── /champ/pickers/new-request
│   ├── /champ/requests
│   ├── /champ/approvals
│   ├── /champ/transfers
│   ├── /champ/resignations
│   ├── /champ/notifications
│   └── /champ/profile
│
├── /area-manager
│   ├── /area-manager/dashboard
│   ├── /area-manager/chains
│   ├── /area-manager/branches
│   ├── /area-manager/champs
│   ├── /area-manager/champs/new-request
│   ├── /area-manager/pickers
│   ├── /area-manager/approvals
│   ├── /area-manager/transfers
│   ├── /area-manager/performance
│   ├── /area-manager/notifications
│   └── /area-manager/profile
│
├── /workforce
│   ├── /workforce/dashboard
│   ├── /workforce/staffing
│   ├── /workforce/coverage
│   ├── /workforce/requests
│   ├── /workforce/performance
│   └── /workforce/notifications
│
├── /operations
│   ├── /operations/dashboard
│   ├── /operations/areas
│   ├── /operations/chains
│   ├── /operations/branches
│   ├── /operations/requests
│   ├── /operations/performance
│   └── /operations/notifications
│
├── /senior-operations
│   ├── /senior-operations/dashboard
│   ├── /senior-operations/performance
│   ├── /senior-operations/requests
│   ├── /senior-operations/audit-summary
│   └── /senior-operations/notifications
│
├── /admin
│   ├── /admin/dashboard
│   ├── /admin/users
│   ├── /admin/users/new
│   ├── /admin/users/[userId]
│   ├── /admin/organization
│   ├── /admin/organization/tree
│   ├── /admin/organization/chains
│   ├── /admin/organization/chains/new
│   ├── /admin/organization/chains/[chainId]
│   ├── /admin/organization/branches
│   ├── /admin/organization/branches/new
│   ├── /admin/organization/branches/[branchId]
│   ├── /admin/approvals
│   ├── /admin/approval-settings
│   ├── /admin/lifecycle
│   ├── /admin/lifecycle/transfers
│   ├── /admin/lifecycle/resignations
│   ├── /admin/notifications
│   ├── /admin/audit-logs
│   └── /admin/reports
│
└── /super-admin
    ├── /super-admin/dashboard
    ├── /super-admin/users
    ├── /super-admin/organization
    ├── /super-admin/approvals
    ├── /super-admin/approval-settings
    ├── /super-admin/audit-logs
    ├── /super-admin/security
    ├── /super-admin/settings
    ├── /super-admin/settings/roles
    ├── /super-admin/settings/workflows
    └── /super-admin/system-health
```

---

## 5. Navigation by Role

### Picker Sidebar

- Dashboard
- My Performance
- Branch Performance
- Branch Ranking
- My Requests
- Notifications
- Profile

### Champ Sidebar

- Dashboard
- Branch
- Pickers
- Add Picker Request
- Approvals
- Transfers
- Resignations
- Notifications
- Profile

### Area Manager Sidebar

- Dashboard
- Chains/Branches
- Champs
- Pickers
- Approvals
- Transfers
- Performance
- Notifications

### Admin Sidebar

- Dashboard
- Users
- Organization
- Approvals
- Lifecycle
- Notifications
- Audit Logs
- Reports

### Super Admin Sidebar

- Dashboard
- Users
- Organization
- Approvals
- Workflow Settings
- Role Settings
- Audit Logs
- Security
- System Health

---

## 6. Key User Journeys

### 6.1 Picker Requests Annual Leave

1. Picker logs in.
2. Picker opens My Requests.
3. Picker creates Annual Leave request.
4. Request is submitted.
5. Champ receives notification.
6. Champ approves.
7. Area Manager receives notification.
8. Area Manager approves.
9. Admin receives notification.
10. Admin gives final approval.
11. Picker receives final notification.
12. Request history remains visible.

### 6.2 Champ Requests New Picker

1. Champ opens Add Picker Request.
2. Champ fills picker data:
   - name
   - national ID
   - phone
   - address
   - ID card image
   - personal image
   - branch
3. Request is submitted to Area Manager.
4. Area Manager approves.
5. Admin finalizes.
6. System creates picker account.
7. Picker status becomes Pending Setup.
8. Setup token is generated.
9. Champ/requester receives notification.
10. Picker completes first-login password setup.
11. Picker becomes Active.

### 6.3 Area Manager Requests New Champ

1. Area Manager opens Add Champ Request.
2. Area Manager fills champ data.
3. Request enters approval flow.
4. Admin/Operations approves.
5. System creates champ account.
6. Champ completes setup.
7. Champ is assigned to branch.

### 6.4 Same Chain Transfer

1. Requester creates transfer request.
2. System validates source branch and target branch are in the same chain.
3. Area Manager approves.
4. Admin finalizes.
5. Old assignment gets end date.
6. New assignment is created.
7. Notifications are sent.

### 6.5 Cross Chain Transfer

1. Requester creates transfer request.
2. System detects source and target branches are in different chains.
3. Current Area Manager approves.
4. Target Area Manager approves.
5. Admin finalizes.
6. Old assignment ends.
7. New assignment starts.
8. Notifications are sent to relevant parties.

### 6.6 Resignation

1. Champ or Area Manager submits resignation request.
2. Approval flow runs.
3. Admin finalizes.
4. User status becomes On Hold or Resigned.
5. Login is disabled.
6. Assignment is ended.
7. History remains available.

---

## 7. Permission Matrix — First Version

| Capability | Picker | Champ | Area Manager | Workforce | Ops | Senior Ops | Admin | Super Admin |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| View own profile | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| View own performance | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| View branch performance | Own branch | Assigned branch | Scoped | Scoped | All/Scoped | All | All | All |
| View picker sensitive data | Self only | Scoped | Scoped | Limited | Limited | Limited | Yes | Yes |
| Create annual leave request | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Request add picker | No | Yes | Yes | No | No | No | Yes | Yes |
| Request add champ | No | No | Yes | No | No | No | Yes | Yes |
| Approve picker request | No | Yes | Yes | No | Maybe | Maybe | Yes | Yes |
| Create chain | No | No | No | No | No | No | Yes | Yes |
| Create branch | No | No | No | No | No | No | Yes | Yes |
| Manage roles | No | No | No | No | No | No | Limited | Yes |
| Override approval | No | No | No | No | No | Maybe | Yes | Yes |
| View audit logs | No | No | Limited | Limited | Limited | Yes | Yes | Yes |

This matrix must be refined in phase specs.

---

## 8. Data Access Scoping

### Picker

Can access:

- own user
- own profile
- own requests
- allowed branch-level summarized performance
- own notifications

### Champ

Can access:

- own profile
- assigned branch
- pickers assigned to that branch
- requests related to assigned pickers/branch
- approval items assigned to them

### Area Manager

Can access:

- chains/branches in their scope
- champs/pickers in their scope
- requests requiring their approval
- scoped dashboards

### Admin

Can access:

- operational management data
- user/profile data needed for admin actions
- all approval queues
- org setup
- audit logs

### Super Admin

Can access everything.

---

## 9. Dashboard Blueprint

### Picker Dashboard

Cards:

- My status
- Current branch
- Current champ
- Last 7 days performance
- Last 30 days performance
- Branch rank
- Pending requests
- Latest notifications

### Champ Dashboard

Cards:

- Branch staffing
- Active pickers
- On leave pickers
- Pending approvals
- Requests aging
- Branch performance summary
- Top/bottom pickers once KPIs exist

### Area Manager Dashboard

Cards:

- Chains/branches in scope
- Champs in scope
- Pickers in scope
- Pending approvals
- Transfer requests
- Branch ranking
- Performance summary

### Admin Dashboard

Cards:

- Total users
- Active users
- Pending setup users
- Pending approvals
- On hold/resigned users
- Recent audit logs
- Recently created chains/branches

### Super Admin Dashboard

Cards:

- Global user count
- Global branch count
- Global approval queue
- System alerts
- Role distribution
- Workflow health
- Audit summary
- Security events

---

## 10. MVP Definition

A serious MVP should include:

1. Authentication
2. Role-based routing
3. User management
4. Chain/branch management
5. Assignment management
6. Organization tree
7. Generic approval engine
8. Annual leave request
9. Add picker request
10. Add champ request
11. Notification center
12. Audit logs
13. First-login password setup
14. Transfer/resignation flows basic
15. Basic dashboards without advanced KPI complexity

KPIs come after the operational skeleton is stable.
