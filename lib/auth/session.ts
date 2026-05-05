import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { createSecretToken, hashToken } from "./tokens";
import type { Role, SessionUser } from "./types";
import {
  canAccessPath,
  getDashboardPathForRole,
  isBlockedStatus,
  requiresFirstLogin,
} from "./routing";

const sessionCookieName = "plus_session";
const sessionDurationMs = 1000 * 60 * 60 * 24 * 7;

export type CurrentSession = {
  id: string;
  user: SessionUser;
  expiresAt: Date;
};

export async function createSession(userId: string) {
  const token = createSecretToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + sessionDurationMs);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export async function deleteCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (token) {
    await prisma.session.deleteMany({
      where: {
        tokenHash: hashToken(token),
      },
    });
  }

  await clearSessionCookie();
}

export async function getCurrentSession(): Promise<CurrentSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: {
      tokenHash: hashToken(token),
    },
    include: {
      user: true,
    },
  });

  if (!session || session.expiresAt <= new Date()) {
    await clearSessionCookie();
    return null;
  }

  return {
    id: session.id,
    expiresAt: session.expiresAt,
    user: {
      id: session.user.id,
      name: session.user.name,
      username: session.user.username,
      role: session.user.role,
      status: session.user.status,
      mustChangePassword: session.user.mustChangePassword,
    },
  };
}

export async function requireSession() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  if (isBlockedStatus(session.user.status)) {
    await deleteCurrentSession();
    redirect("/login");
  }

  if (requiresFirstLogin(session.user)) {
    redirect("/first-login");
  }

  return session;
}

export async function requireRole(role: Role, pathname: string) {
  const session = await requireSession();

  if (!canAccessPath(session.user.role, pathname) || !canAccessPath(role, pathname)) {
    redirect("/access-denied");
  }

  return session;
}

export async function redirectAuthenticatedUser() {
  const session = await getCurrentSession();

  if (!session) {
    return;
  }

  if (isBlockedStatus(session.user.status)) {
    await deleteCurrentSession();
    redirect("/login");
  }

  if (requiresFirstLogin(session.user)) {
    redirect("/first-login");
  }

  redirect(getDashboardPathForRole(session.user.role));
}
