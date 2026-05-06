import type { NotificationType } from "@/generated/prisma/client";
import type { Role } from "@/lib/auth/types";
import { prisma } from "@/lib/db/prisma";

type NotificationClient = Pick<typeof prisma, "notification" | "user">;

type NotificationInput = {
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  linkUrl?: string | null;
};

export async function createNotification(
  input: NotificationInput,
  client: NotificationClient = prisma,
) {
  await client.notification.create({
    data: {
      userId: input.userId,
      title: input.title,
      body: input.body,
      type: input.type,
      linkUrl: input.linkUrl ?? null,
    },
  });
}

export async function notifyApproverRole({
  approverRole,
  requestId,
  requestType,
  client = prisma,
}: {
  approverRole: Role;
  requestId: string;
  requestType: string;
  client?: NotificationClient;
}) {
  const users = await client.user.findMany({
    where: {
      role: approverRole,
      status: "ACTIVE",
    },
    select: { id: true },
  });

  if (users.length === 0) {
    return;
  }

  await client.notification.createMany({
    data: users.map((user) => ({
      userId: user.id,
      title: "Approval required",
      body: `${requestType.replaceAll("_", " ")} is waiting for your decision.`,
      type: "APPROVAL_REQUIRED",
      linkUrl: `/approvals/${requestId}`,
    })),
  });
}

export async function notifyRequesterFinalState({
  requesterId,
  requestId,
  status,
  client = prisma,
}: {
  requesterId: string;
  requestId: string;
  status: "APPROVED" | "REJECTED" | "CANCELLED";
  client?: NotificationClient;
}) {
  const type =
    status === "APPROVED"
      ? "REQUEST_COMPLETED"
      : status === "REJECTED"
        ? "REQUEST_REJECTED"
        : "REQUEST_CANCELLED";

  await createNotification(
    {
      userId: requesterId,
      title: `Request ${status.toLowerCase()}`,
      body: `Your request has been ${status.toLowerCase()}.`,
      type,
      linkUrl: `/requests/${requestId}`,
    },
    client,
  );
}
