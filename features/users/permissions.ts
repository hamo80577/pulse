import type { Role } from "@/lib/auth/types";

export function canManageUsers(role: Role) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}
