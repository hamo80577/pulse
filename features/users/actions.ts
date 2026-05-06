"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/audit/log";
import { hashPassword } from "@/lib/auth/password";
import { requireSession } from "@/lib/auth/session";
import { createSecretToken, hashToken } from "@/lib/auth/tokens";
import { prisma } from "@/lib/db/prisma";
import {
  userCreateInputSchema,
  userUpdateInputSchema,
} from "@/lib/validation/users";
import {
  buildCreateUserData,
  buildUpdateUserData,
  isUniqueConstraintError,
  toAuditJson,
} from "./mutations";
import { canManageUsers } from "./permissions";

export type UserActionState = {
  error?: string;
  success?: string;
};

const setupTokenDurationMs = 1000 * 60 * 60 * 24 * 7;

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

async function requireUserManagementSession() {
  const session = await requireSession();

  if (!canManageUsers(session.user.role)) {
    redirect("/access-denied");
  }

  return session;
}

async function createSetupToken(userId: string) {
  const token = createSecretToken();

  await prisma.setupToken.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + setupTokenDurationMs),
    },
  });

  return token;
}

function uniqueErrorMessage() {
  return "Username, email, national ID, shopper ID, or IBS ID already exists.";
}

function formInput(formData: FormData) {
  return {
    name: getFormValue(formData, "name"),
    username: getFormValue(formData, "username"),
    email: getFormValue(formData, "email"),
    phone: getFormValue(formData, "phone"),
    role: getFormValue(formData, "role"),
    status: getFormValue(formData, "status"),
    nationalId: getFormValue(formData, "nationalId"),
    shopperId: getFormValue(formData, "shopperId"),
    ibsId: getFormValue(formData, "ibsId"),
    address: getFormValue(formData, "address"),
    personalPhotoUrl: getFormValue(formData, "personalPhotoUrl"),
    idCardFrontUrl: getFormValue(formData, "idCardFrontUrl"),
    idCardBackUrl: getFormValue(formData, "idCardBackUrl"),
    hireDate: getFormValue(formData, "hireDate"),
    employmentStatus: getFormValue(formData, "employmentStatus") || "ACTIVE",
  };
}

export async function createUserAction(
  _previousState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const session = await requireUserManagementSession();
  const parsed = userCreateInputSchema.safeParse(formInput(formData));

  if (!parsed.success) {
    return { error: "Enter valid user and profile details." };
  }

  const temporaryPassword = createSecretToken(18);
  const passwordHash = await hashPassword(temporaryPassword);

  try {
    const user = await prisma.user.create({
      data: buildCreateUserData({ input: parsed.data, passwordHash }),
      select: {
        id: true,
        employeeProfile: { select: { id: true } },
      },
    });
    await createSetupToken(user.id);
    await createAuditLog({
      actorUserId: session.user.id,
      action: "USER_CREATED",
      entityType: "User",
      entityId: user.id,
      newValueJson: toAuditJson({ userId: user.id, profileId: user.employeeProfile?.id }),
    });
    if (user.employeeProfile) {
      await createAuditLog({
        actorUserId: session.user.id,
        action: "EMPLOYEE_PROFILE_CREATED",
        entityType: "EmployeeProfile",
        entityId: user.employeeProfile.id,
        newValueJson: toAuditJson({ userId: user.id }),
      });
    }

    revalidatePath("/admin/workforce");
    redirect(`/admin/workforce/users/${user.id}`);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: uniqueErrorMessage() };
    }

    throw error;
  }
}

export async function updateUserAndProfileAction(
  _previousState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const session = await requireUserManagementSession();
  const userId = getFormValue(formData, "userId");
  const parsed = userUpdateInputSchema.safeParse(formInput(formData));

  if (!userId || !parsed.success) {
    return { error: "Enter valid user and profile details." };
  }

  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      employeeProfile: true,
    },
  });

  if (!existing) {
    return { error: "User was not found." };
  }

  const updateData = buildUpdateUserData(parsed.data);

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: updateData.user,
      }),
      prisma.employeeProfile.upsert({
        where: { userId },
        create: {
          userId,
          ...updateData.profile,
        },
        update: updateData.profile,
      }),
      prisma.auditLog.create({
        data: {
          actorUserId: session.user.id,
          action: "USER_UPDATED",
          entityType: "User",
          entityId: userId,
          oldValueJson: toAuditJson(existing),
          newValueJson: toAuditJson({ user: updateData.user, profile: updateData.profile }),
        },
      }),
      prisma.auditLog.create({
        data: {
          actorUserId: session.user.id,
          action: existing.employeeProfile
            ? "EMPLOYEE_PROFILE_UPDATED"
            : "EMPLOYEE_PROFILE_CREATED",
          entityType: "EmployeeProfile",
          entityId: existing.employeeProfile?.id ?? null,
          oldValueJson: toAuditJson(existing.employeeProfile),
          newValueJson: toAuditJson(updateData.profile),
        },
      }),
    ]);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: uniqueErrorMessage() };
    }

    throw error;
  }

  revalidatePath("/admin/workforce");
  return { success: "User updated." };
}

export async function forcePasswordResetAction(formData: FormData) {
  const session = await requireUserManagementSession();
  const userId = getFormValue(formData, "userId");

  if (!userId) {
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    return;
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { mustChangePassword: true },
    }),
    prisma.setupToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: "USER_PASSWORD_RESET_FORCED",
        entityType: "User",
        entityId: userId,
      },
    }),
  ]);
  await createSetupToken(userId);
  revalidatePath(`/admin/workforce/users/${userId}`);
}
