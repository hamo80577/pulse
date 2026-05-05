import type { Role, SessionUser, UserStatus } from "./types";

const roleDashboardPaths: Record<Role, string> = {
  PICKER: "/picker",
  CHAMP: "/champ",
  AREA_MANAGER: "/area-manager",
  WORKFORCE_MANAGER: "/workforce",
  OPERATIONS_MANAGER: "/operations",
  SENIOR_OPERATIONS_MANAGER: "/senior-operations",
  ADMIN: "/admin",
  SUPER_ADMIN: "/super-admin",
};

const blockedStatuses = new Set<UserStatus>([
  "ON_HOLD",
  "SUSPENDED",
  "RESIGNED",
  "DELETED",
]);

export function getDashboardPathForRole(role: Role) {
  return roleDashboardPaths[role];
}

export function isBlockedStatus(status: UserStatus) {
  return blockedStatuses.has(status);
}

export function requiresFirstLogin(
  user: Pick<SessionUser, "status" | "mustChangePassword">,
) {
  return user.status === "PENDING_SETUP" || user.mustChangePassword;
}

export function canAccessPath(role: Role, pathname: string) {
  return pathname === getDashboardPathForRole(role);
}

export function getRoleFromDashboardPath(pathname: string): Role | null {
  const match = Object.entries(roleDashboardPaths).find(([, path]) => path === pathname);

  return match ? (match[0] as Role) : null;
}

export const dashboardPaths = Object.values(roleDashboardPaths);
