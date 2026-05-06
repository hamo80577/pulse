import type { Prisma } from "@/generated/prisma/client";
import type { SessionUser } from "@/lib/auth/types";
import { prisma } from "@/lib/db/prisma";
import { canManageApprovalQueue, canViewApprovalRequest } from "./rules";

const safeApprovalUserSelect = {
  id: true,
  name: true,
  role: true,
  status: true,
} satisfies Prisma.UserSelect;

export const approvalStepSelect = {
  id: true,
  stepOrder: true,
  approverRole: true,
  approverUserId: true,
  status: true,
  decision: true,
  comment: true,
  decidedAt: true,
  approver: {
    select: safeApprovalUserSelect,
  },
} satisfies Prisma.ApprovalStepSelect;

export const approvalRequestListSelect = {
  id: true,
  requestType: true,
  status: true,
  currentStepOrder: true,
  createdAt: true,
  submittedAt: true,
  finalDecisionAt: true,
  requester: {
    select: safeApprovalUserSelect,
  },
  targetUser: {
    select: safeApprovalUserSelect,
  },
  steps: {
    select: approvalStepSelect,
    orderBy: { stepOrder: "asc" },
  },
} satisfies Prisma.ApprovalRequestSelect;

export const approvalRequestDetailSelect = {
  ...approvalRequestListSelect,
  payloadJson: true,
  updatedAt: true,
} satisfies Prisma.ApprovalRequestSelect;

export type ApprovalRequestListItem = Prisma.ApprovalRequestGetPayload<{
  select: typeof approvalRequestListSelect;
}>;
export type ApprovalRequestDetail = Prisma.ApprovalRequestGetPayload<{
  select: typeof approvalRequestDetailSelect;
}>;

export async function getMyApprovalRequests(userId: string) {
  return prisma.approvalRequest.findMany({
    where: { requesterId: userId },
    select: approvalRequestListSelect,
    orderBy: { createdAt: "desc" },
  });
}

export async function getApprovalQueue(user: SessionUser) {
  return prisma.approvalRequest.findMany({
    where: {
      status: "PENDING",
      steps: {
        some: {
          status: "ACTIVE",
          OR: [
            { approverUserId: user.id },
            { approverUserId: null, approverRole: user.role },
          ],
        },
      },
    },
    select: approvalRequestListSelect,
    orderBy: { createdAt: "asc" },
  });
}

export async function getAdminApprovalQueue() {
  return prisma.approvalRequest.findMany({
    where: {
      status: {
        in: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
      },
    },
    select: approvalRequestListSelect,
    orderBy: { createdAt: "desc" },
  });
}

export async function getApprovalRequestDetail(
  requestId: string,
  user: SessionUser,
) {
  const request = await prisma.approvalRequest.findUnique({
    where: { id: requestId },
    select: approvalRequestDetailSelect,
  });

  if (!request) {
    return null;
  }

  if (
    !canViewApprovalRequest(
      { id: user.id, role: user.role },
      {
        requesterId: request.requester.id,
        targetUserId: request.targetUser?.id ?? null,
        steps: request.steps.map((step) => ({
          approverRole: step.approverRole,
          approverUserId: step.approverUserId,
        })),
      },
    )
  ) {
    return null;
  }

  return request;
}

export function canUseAdminApprovalQueue(user: SessionUser) {
  return canManageApprovalQueue(user.role);
}
