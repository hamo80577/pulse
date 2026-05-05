import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

type AuditLogInput = {
  actorUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  oldValueJson?: Prisma.InputJsonValue;
  newValueJson?: Prisma.InputJsonValue;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export async function createAuditLog(input: AuditLogInput) {
  await prisma.auditLog.create({
    data: {
      actorUserId: input.actorUserId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      oldValueJson: input.oldValueJson,
      newValueJson: input.newValueJson,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    },
  });
}
