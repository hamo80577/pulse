"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@/generated/prisma/client";
import { createAuditLog } from "@/lib/audit/log";
import { requireSession } from "@/lib/auth/session";
import type { Role } from "@/lib/auth/types";
import { prisma } from "@/lib/db/prisma";
import {
  branchAssignmentInputSchema,
  branchInputSchema,
  chainInputSchema,
  managerRelationInputSchema,
} from "@/lib/validation/organization";
import {
  canMutateOrganization,
  hasDuplicateActivePrimaryAssignment,
  isAssignmentRoleCompatible,
  isManagerRelationRolePairAllowed,
} from "./rules";

export type OrganizationActionState = {
  error?: string;
  success?: string;
};

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

async function requireOrganizationMutationSession() {
  const session = await requireSession();

  if (!canMutateOrganization(session.user.role)) {
    redirect("/access-denied");
  }

  return session;
}

function toDate(dateString: string) {
  return new Date(`${dateString}T00:00:00.000Z`);
}

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

function toAuditJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function createChainAction(
  _previousState: OrganizationActionState,
  formData: FormData,
): Promise<OrganizationActionState> {
  const session = await requireOrganizationMutationSession();
  const parsed = chainInputSchema.safeParse({
    name: getFormValue(formData, "name"),
    code: getFormValue(formData, "code"),
    status: getFormValue(formData, "status") || "ACTIVE",
  });

  if (!parsed.success) {
    return { error: "Enter a valid chain name and status." };
  }

  let chainId = "";

  try {
    const chain = await prisma.chain.create({
      data: parsed.data,
    });
    chainId = chain.id;
    await createAuditLog({
      actorUserId: session.user.id,
      action: "ORG_CHAIN_CREATED",
      entityType: "Chain",
      entityId: chain.id,
      newValueJson: toAuditJson(chain),
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: "A chain with this name or code already exists." };
    }

    throw error;
  }

  revalidatePath("/admin/organization");
  redirect(`/admin/organization/chains/${chainId}`);
}

export async function updateChainAction(
  _previousState: OrganizationActionState,
  formData: FormData,
): Promise<OrganizationActionState> {
  const session = await requireOrganizationMutationSession();
  const chainId = getFormValue(formData, "chainId");
  const parsed = chainInputSchema.safeParse({
    name: getFormValue(formData, "name"),
    code: getFormValue(formData, "code"),
    status: getFormValue(formData, "status") || "ACTIVE",
  });

  if (!chainId || !parsed.success) {
    return { error: "Enter valid chain details." };
  }

  const existing = await prisma.chain.findUnique({ where: { id: chainId } });

  if (!existing) {
    return { error: "Chain was not found." };
  }

  try {
    const chain = await prisma.chain.update({
      where: { id: chainId },
      data: parsed.data,
    });
    await createAuditLog({
      actorUserId: session.user.id,
      action: "ORG_CHAIN_UPDATED",
      entityType: "Chain",
      entityId: chain.id,
      oldValueJson: toAuditJson(existing),
      newValueJson: toAuditJson(chain),
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: "A chain with this name or code already exists." };
    }

    throw error;
  }

  revalidatePath("/admin/organization");
  return { success: "Chain updated." };
}

export async function createBranchAction(
  _previousState: OrganizationActionState,
  formData: FormData,
): Promise<OrganizationActionState> {
  const session = await requireOrganizationMutationSession();
  const parsed = branchInputSchema.safeParse({
    chainId: getFormValue(formData, "chainId"),
    name: getFormValue(formData, "name"),
    code: getFormValue(formData, "code"),
    address: getFormValue(formData, "address"),
    status: getFormValue(formData, "status") || "ACTIVE",
  });

  if (!parsed.success) {
    return { error: "Enter valid branch details." };
  }

  const chainExists = await prisma.chain.findUnique({
    where: { id: parsed.data.chainId },
    select: { id: true },
  });

  if (!chainExists) {
    return { error: "Select an existing active chain." };
  }

  let branchId = "";

  try {
    const branch = await prisma.branch.create({
      data: parsed.data,
    });
    branchId = branch.id;
    await createAuditLog({
      actorUserId: session.user.id,
      action: "ORG_BRANCH_CREATED",
      entityType: "Branch",
      entityId: branch.id,
      newValueJson: toAuditJson(branch),
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: "A branch with this name or code already exists." };
    }

    throw error;
  }

  revalidatePath("/admin/organization");
  redirect(`/admin/organization/branches/${branchId}`);
}

export async function updateBranchAction(
  _previousState: OrganizationActionState,
  formData: FormData,
): Promise<OrganizationActionState> {
  const session = await requireOrganizationMutationSession();
  const branchId = getFormValue(formData, "branchId");
  const parsed = branchInputSchema.safeParse({
    chainId: getFormValue(formData, "chainId"),
    name: getFormValue(formData, "name"),
    code: getFormValue(formData, "code"),
    address: getFormValue(formData, "address"),
    status: getFormValue(formData, "status") || "ACTIVE",
  });

  if (!branchId || !parsed.success) {
    return { error: "Enter valid branch details." };
  }

  const existing = await prisma.branch.findUnique({ where: { id: branchId } });

  if (!existing) {
    return { error: "Branch was not found." };
  }

  try {
    const branch = await prisma.branch.update({
      where: { id: branchId },
      data: parsed.data,
    });
    await createAuditLog({
      actorUserId: session.user.id,
      action: "ORG_BRANCH_UPDATED",
      entityType: "Branch",
      entityId: branch.id,
      oldValueJson: toAuditJson(existing),
      newValueJson: toAuditJson(branch),
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: "A branch with this name or code already exists." };
    }

    throw error;
  }

  revalidatePath("/admin/organization");
  return { success: "Branch updated." };
}

export async function createBranchAssignmentAction(
  _previousState: OrganizationActionState,
  formData: FormData,
): Promise<OrganizationActionState> {
  const session = await requireOrganizationMutationSession();
  const parsed = branchAssignmentInputSchema.safeParse({
    userId: getFormValue(formData, "userId"),
    branchId: getFormValue(formData, "branchId"),
    roleAtBranch: getFormValue(formData, "roleAtBranch"),
    startDate: getFormValue(formData, "startDate"),
    isPrimary: formData.get("isPrimary") === "on",
  });

  if (!parsed.success) {
    return { error: "Enter valid assignment details." };
  }

  const [user, branch, existingAssignments] = await Promise.all([
    prisma.user.findUnique({ where: { id: parsed.data.userId } }),
    prisma.branch.findUnique({ where: { id: parsed.data.branchId } }),
    prisma.branchAssignment.findMany({
      where: {
        userId: parsed.data.userId,
        roleAtBranch: parsed.data.roleAtBranch,
        status: "ACTIVE",
        isPrimary: true,
      },
      select: {
        userId: true,
        roleAtBranch: true,
        status: true,
        isPrimary: true,
      },
    }),
  ]);

  if (!user || !branch) {
    return { error: "Select an existing user and branch." };
  }

  if (!isAssignmentRoleCompatible(user.role as Role, parsed.data.roleAtBranch)) {
    return { error: "Assignment role must match the selected user's role." };
  }

  if (
    hasDuplicateActivePrimaryAssignment(existingAssignments, {
      userId: parsed.data.userId,
      roleAtBranch: parsed.data.roleAtBranch,
      isPrimary: parsed.data.isPrimary,
    })
  ) {
    return {
      error:
        "End the user's current active primary assignment before creating a new one.",
    };
  }

  const assignment = await prisma.branchAssignment.create({
    data: {
      userId: parsed.data.userId,
      branchId: parsed.data.branchId,
      roleAtBranch: parsed.data.roleAtBranch,
      startDate: toDate(parsed.data.startDate),
      isPrimary: parsed.data.isPrimary,
      createdById: session.user.id,
    },
  });

  await createAuditLog({
    actorUserId: session.user.id,
    action: "ORG_BRANCH_ASSIGNMENT_CREATED",
    entityType: "BranchAssignment",
    entityId: assignment.id,
    newValueJson: toAuditJson(assignment),
  });

  revalidatePath("/admin/organization");
  return { success: "Assignment created." };
}

export async function endBranchAssignmentAction(formData: FormData) {
  const session = await requireOrganizationMutationSession();
  const assignmentId = getFormValue(formData, "assignmentId");

  if (!assignmentId) {
    return;
  }

  const existing = await prisma.branchAssignment.findUnique({
    where: { id: assignmentId },
  });

  if (!existing || existing.status === "ENDED") {
    return;
  }

  const assignment = await prisma.branchAssignment.update({
    where: { id: assignmentId },
    data: {
      status: "ENDED",
      endDate: new Date(),
    },
  });

  await createAuditLog({
    actorUserId: session.user.id,
    action: "ORG_BRANCH_ASSIGNMENT_ENDED",
    entityType: "BranchAssignment",
    entityId: assignment.id,
    oldValueJson: toAuditJson(existing),
    newValueJson: toAuditJson(assignment),
  });

  revalidatePath("/admin/organization");
}

export async function createManagerRelationAction(
  _previousState: OrganizationActionState,
  formData: FormData,
): Promise<OrganizationActionState> {
  const session = await requireOrganizationMutationSession();
  const parsed = managerRelationInputSchema.safeParse({
    employeeUserId: getFormValue(formData, "employeeUserId"),
    managerUserId: getFormValue(formData, "managerUserId"),
    relationType: getFormValue(formData, "relationType"),
    startDate: getFormValue(formData, "startDate"),
  });

  if (!parsed.success) {
    return { error: "Enter valid manager relation details." };
  }

  const [employee, manager, existingActiveRelation] = await Promise.all([
    prisma.user.findUnique({ where: { id: parsed.data.employeeUserId } }),
    prisma.user.findUnique({ where: { id: parsed.data.managerUserId } }),
    prisma.managerRelation.findFirst({
      where: {
        employeeUserId: parsed.data.employeeUserId,
        relationType: parsed.data.relationType,
        status: "ACTIVE",
      },
    }),
  ]);

  if (!employee || !manager) {
    return { error: "Select existing employee and manager users." };
  }

  if (
    !isManagerRelationRolePairAllowed(
      parsed.data.relationType,
      employee.role as Role,
      manager.role as Role,
    )
  ) {
    return { error: "Manager relation roles do not match the selected type." };
  }

  if (existingActiveRelation) {
    return { error: "End the current active manager relation before creating a new one." };
  }

  const relation = await prisma.managerRelation.create({
    data: {
      employeeUserId: parsed.data.employeeUserId,
      managerUserId: parsed.data.managerUserId,
      relationType: parsed.data.relationType,
      startDate: toDate(parsed.data.startDate),
    },
  });

  await createAuditLog({
    actorUserId: session.user.id,
    action: "ORG_MANAGER_RELATION_CREATED",
    entityType: "ManagerRelation",
    entityId: relation.id,
    newValueJson: toAuditJson(relation),
  });

  revalidatePath("/admin/organization");
  return { success: "Manager relation created." };
}

export async function endManagerRelationAction(formData: FormData) {
  const session = await requireOrganizationMutationSession();
  const relationId = getFormValue(formData, "relationId");

  if (!relationId) {
    return;
  }

  const existing = await prisma.managerRelation.findUnique({
    where: { id: relationId },
  });

  if (!existing || existing.status === "ENDED") {
    return;
  }

  const relation = await prisma.managerRelation.update({
    where: { id: relationId },
    data: {
      status: "ENDED",
      endDate: new Date(),
    },
  });

  await createAuditLog({
    actorUserId: session.user.id,
    action: "ORG_MANAGER_RELATION_ENDED",
    entityType: "ManagerRelation",
    entityId: relation.id,
    oldValueJson: toAuditJson(existing),
    newValueJson: toAuditJson(relation),
  });

  revalidatePath("/admin/organization");
}
