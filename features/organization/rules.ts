import type { Role } from "@/lib/auth/types";
import type {
  BranchAssignmentRoleInput,
  ManagerRelationTypeInput,
} from "@/lib/validation/organization";

type AssignmentLike = {
  userId: string;
  roleAtBranch: BranchAssignmentRoleInput;
  status: "ACTIVE" | "ENDED";
  isPrimary: boolean;
};

type AssignmentCandidate = {
  userId: string;
  roleAtBranch: BranchAssignmentRoleInput;
  isPrimary: boolean;
};

export function canMutateOrganization(role: Role) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isAssignmentRoleCompatible(
  userRole: Role,
  assignmentRole: BranchAssignmentRoleInput,
) {
  return userRole === assignmentRole;
}

export function hasDuplicateActivePrimaryAssignment(
  assignments: AssignmentLike[],
  candidate: AssignmentCandidate,
) {
  if (!candidate.isPrimary) {
    return false;
  }

  return assignments.some(
    (assignment) =>
      assignment.userId === candidate.userId &&
      assignment.roleAtBranch === candidate.roleAtBranch &&
      assignment.status === "ACTIVE" &&
      assignment.isPrimary,
  );
}

export function isManagerRelationRolePairAllowed(
  relationType: ManagerRelationTypeInput,
  employeeRole: Role,
  managerRole: Role,
) {
  if (relationType === "CHAMP_TO_PICKER") {
    return employeeRole === "PICKER" && managerRole === "CHAMP";
  }

  if (relationType === "AREA_MANAGER_TO_CHAMP") {
    return employeeRole === "CHAMP" && managerRole === "AREA_MANAGER";
  }

  return (
    relationType === "OPERATIONS_TO_AREA_MANAGER" &&
    employeeRole === "AREA_MANAGER" &&
    (managerRole === "OPERATIONS_MANAGER" ||
      managerRole === "SENIOR_OPERATIONS_MANAGER")
  );
}
