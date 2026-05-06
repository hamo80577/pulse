export const roles = [
  "PICKER",
  "CHAMP",
  "AREA_MANAGER",
  "WORKFORCE_MANAGER",
  "OPERATIONS_MANAGER",
  "SENIOR_OPERATIONS_MANAGER",
  "ADMIN",
  "SUPER_ADMIN",
] as const;

export type Role = (typeof roles)[number];

export const userStatuses = [
  "ACTIVE",
  "PENDING_SETUP",
  "ON_HOLD",
  "SUSPENDED",
  "RESIGNED",
  "DELETED",
] as const;

export type UserStatus = (typeof userStatuses)[number];

export type SessionUser = {
  id: string;
  name: string;
  role: Role;
  status: UserStatus;
  mustChangePassword: boolean;
};
