"use server";

import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/audit/log";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { getDashboardPathForRole, isBlockedStatus } from "@/lib/auth/routing";
import {
  createSession,
  deleteCurrentSession,
  getCurrentSession,
} from "@/lib/auth/session";
import { hashToken } from "@/lib/auth/tokens";
import { prisma } from "@/lib/db/prisma";
import { loginSchema, validateFirstLoginInput } from "@/lib/validation/auth";

export type AuthActionState = {
  error?: string;
};

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    username: getFormValue(formData, "username"),
    password: getFormValue(formData, "password"),
  });

  if (!parsed.success) {
    return { error: "Enter a valid username and password." };
  }

  const user = await prisma.user.findUnique({
    where: {
      username: parsed.data.username,
    },
  });

  if (!user) {
    await createAuditLog({
      action: "AUTH_LOGIN_FAILURE",
      entityType: "User",
      newValueJson: { username: parsed.data.username, reason: "USER_NOT_FOUND" },
    });
    return { error: "Invalid username or password." };
  }

  if (isBlockedStatus(user.status)) {
    await createAuditLog({
      actorUserId: user.id,
      action: "AUTH_LOGIN_BLOCKED_STATUS",
      entityType: "User",
      entityId: user.id,
      newValueJson: { status: user.status },
    });
    return { error: "This account cannot access the system." };
  }

  const passwordValid = await verifyPassword(parsed.data.password, user.passwordHash);

  if (!passwordValid) {
    await createAuditLog({
      actorUserId: user.id,
      action: "AUTH_LOGIN_FAILURE",
      entityType: "User",
      entityId: user.id,
      newValueJson: { reason: "INVALID_PASSWORD" },
    });
    return { error: "Invalid username or password." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  await createSession(user.id);
  await createAuditLog({
    actorUserId: user.id,
    action: "AUTH_LOGIN_SUCCESS",
    entityType: "User",
    entityId: user.id,
  });

  if (user.status === "PENDING_SETUP" || user.mustChangePassword) {
    redirect("/first-login");
  }

  redirect(getDashboardPathForRole(user.role));
}

export async function logoutAction() {
  const session = await getCurrentSession();

  if (session) {
    await createAuditLog({
      actorUserId: session.user.id,
      action: "AUTH_LOGOUT",
      entityType: "User",
      entityId: session.user.id,
    });
  }

  await deleteCurrentSession();
  redirect("/login");
}

export async function completeFirstLoginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const input = {
    token: getFormValue(formData, "token") || undefined,
    password: getFormValue(formData, "password"),
    confirmPassword: getFormValue(formData, "confirmPassword"),
  };

  const session = await getCurrentSession();
  const token = input.token;
  const setupToken = token
    ? await prisma.setupToken.findUnique({
        where: { tokenHash: hashToken(token) },
        include: { user: true },
      })
    : null;

  const user = setupToken?.user ?? (session
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null);

  if (!user) {
    await createAuditLog({
      action: "AUTH_PASSWORD_SETUP_FAILED",
      entityType: "User",
      newValueJson: { reason: "USER_NOT_FOUND" },
    });
    return { error: "Password setup link is invalid." };
  }

  if (setupToken && (setupToken.usedAt || setupToken.expiresAt <= new Date())) {
    await createAuditLog({
      actorUserId: user.id,
      action: "AUTH_PASSWORD_SETUP_FAILED",
      entityType: "User",
      entityId: user.id,
      newValueJson: { reason: "TOKEN_EXPIRED_OR_USED" },
    });
    return { error: "Password setup link is expired." };
  }

  if (isBlockedStatus(user.status)) {
    return { error: "This account cannot access the system." };
  }

  const parsed = await validateFirstLoginInput(input, {
    username: user.username,
    currentPasswordHash: user.passwordHash,
  });

  if (!parsed.success) {
    return { error: "Enter a valid new password." };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        status: user.status === "PENDING_SETUP" ? "ACTIVE" : user.status,
        mustChangePassword: false,
      },
    }),
    ...(setupToken
      ? [
          prisma.setupToken.update({
            where: { id: setupToken.id },
            data: { usedAt: new Date() },
          }),
        ]
      : []),
    prisma.auditLog.create({
      data: {
        actorUserId: user.id,
        action: "AUTH_FIRST_LOGIN_COMPLETED",
        entityType: "User",
        entityId: user.id,
      },
    }),
  ]);

  if (!session) {
    await createSession(user.id);
  }

  redirect(getDashboardPathForRole(user.role));
}
