"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@/generated/prisma/client";
import type { SessionUser } from "@/lib/auth/types";
import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import {
  approvalDecisionInputSchema,
  approvalRequestInputSchema,
  cancelApprovalRequestInputSchema,
} from "@/lib/validation/approvals";
import { buildApprovalSteps } from "./workflows";
import { canDecideActiveStep, resolveApprovalOutcome } from "./rules";
import {
  notifyApprovalStep,
  notifyRequesterFinalState,
} from "./notifications";

export type ApprovalActionState = {
  error?: string;
  success?: string;
};

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function toAuditJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function createApprovalRequestAction(
  _previousState: ApprovalActionState,
  formData: FormData,
): Promise<ApprovalActionState> {
  const session = await requireSession();
  const parsed = approvalRequestInputSchema.safeParse({
    requestType: getFormValue(formData, "requestType") || "ANNUAL_LEAVE",
    targetUserId: getFormValue(formData, "targetUserId"),
    leaveDate: getFormValue(formData, "leaveDate"),
    reason: getFormValue(formData, "reason"),
  });

  if (!parsed.success) {
    return { error: "Enter valid request details." };
  }

  const steps = buildApprovalSteps(parsed.data.requestType, {
    requesterId: session.user.id,
    targetUserId: parsed.data.targetUserId,
    payloadJson: parsed.data.payloadJson,
  });
  const requestId = await prisma.$transaction(async (transaction) => {
    const request = await transaction.approvalRequest.create({
      data: {
        requestType: parsed.data.requestType,
        requesterId: session.user.id,
        targetUserId: parsed.data.targetUserId,
        status: "PENDING",
        currentStepOrder: 1,
        submittedAt: new Date(),
        payloadJson: parsed.data.payloadJson,
        steps: {
          create: steps,
        },
      },
      select: {
        id: true,
        requestType: true,
      },
    });

    await transaction.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: "APPROVAL_REQUEST_SUBMITTED",
        entityType: "ApprovalRequest",
        entityId: request.id,
        newValueJson: toAuditJson({
          requestType: parsed.data.requestType,
          payloadJson: parsed.data.payloadJson,
        }),
      },
    });

    await notifyApprovalStep({
      approverRole: steps[0].approverRole,
      approverUserId: steps[0].approverUserId,
      requestId: request.id,
      requestType: request.requestType,
      client: transaction,
    });

    return request.id;
  });

  revalidatePath("/requests");
  revalidatePath("/approvals");
  redirect(`/requests/${requestId}`);
}

export async function approveRequestAction(
  _previousState: ApprovalActionState,
  formData: FormData,
): Promise<ApprovalActionState> {
  const session = await requireSession();
  const parsed = approvalDecisionInputSchema.safeParse({
    requestId: getFormValue(formData, "requestId"),
    decision: "APPROVED",
    comment: getFormValue(formData, "comment"),
  });

  if (!parsed.success) {
    return { error: "Approval request is missing." };
  }

  const result = await decideRequest({
    requestId: parsed.data.requestId,
    decision: "APPROVED",
    comment: parsed.data.comment,
    actor: session.user,
  });

  if (!result.success) {
    return { error: result.error };
  }

  revalidatePath("/requests");
  revalidatePath("/approvals");
  revalidatePath(`/approvals/${parsed.data.requestId}`);
  revalidatePath(`/requests/${parsed.data.requestId}`);
  return { success: "Request approved." };
}

export async function rejectRequestAction(
  _previousState: ApprovalActionState,
  formData: FormData,
): Promise<ApprovalActionState> {
  const session = await requireSession();
  const parsed = approvalDecisionInputSchema.safeParse({
    requestId: getFormValue(formData, "requestId"),
    decision: "REJECTED",
    comment: getFormValue(formData, "comment"),
  });

  if (!parsed.success) {
    return { error: "Enter a rejection comment." };
  }

  const result = await decideRequest({
    requestId: parsed.data.requestId,
    decision: "REJECTED",
    comment: parsed.data.comment,
    actor: session.user,
  });

  if (!result.success) {
    return { error: result.error };
  }

  revalidatePath("/requests");
  revalidatePath("/approvals");
  revalidatePath(`/approvals/${parsed.data.requestId}`);
  revalidatePath(`/requests/${parsed.data.requestId}`);
  return { success: "Request rejected." };
}

export async function cancelRequestAction(formData: FormData) {
  const session = await requireSession();
  const parsed = cancelApprovalRequestInputSchema.safeParse({
    requestId: getFormValue(formData, "requestId"),
  });

  if (!parsed.success) {
    return;
  }

  await prisma.$transaction(async (transaction) => {
    const request = await transaction.approvalRequest.findUnique({
      where: { id: parsed.data.requestId },
      select: {
        id: true,
        requesterId: true,
        status: true,
      },
    });

    if (
      !request ||
      request.requesterId !== session.user.id ||
      ["APPROVED", "REJECTED", "CANCELLED"].includes(request.status)
    ) {
      return;
    }

    await transaction.approvalStep.updateMany({
      where: {
        requestId: request.id,
        status: "ACTIVE",
      },
      data: { status: "SKIPPED" },
    });
    await transaction.approvalRequest.update({
      where: { id: request.id },
      data: {
        status: "CANCELLED",
        currentStepOrder: null,
        finalDecisionAt: new Date(),
      },
    });
    await transaction.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: "APPROVAL_REQUEST_CANCELLED",
        entityType: "ApprovalRequest",
        entityId: request.id,
      },
    });
    await notifyRequesterFinalState({
      requesterId: request.requesterId,
      requestId: request.id,
      status: "CANCELLED",
      client: transaction,
    });
  });

  revalidatePath("/requests");
  redirect("/requests");
}

async function decideRequest({
  requestId,
  decision,
  comment,
  actor,
}: {
  requestId: string;
  decision: "APPROVED" | "REJECTED";
  comment: string | null;
  actor: {
    id: string;
    role: SessionUser["role"];
  };
}): Promise<{ success: true } | { success: false; error: string }> {
  return prisma.$transaction(async (transaction) => {
    const request = await transaction.approvalRequest.findUnique({
      where: { id: requestId },
      select: {
        id: true,
        requesterId: true,
        requestType: true,
        status: true,
        steps: {
          select: {
            id: true,
            stepOrder: true,
            status: true,
            approverRole: true,
            approverUserId: true,
          },
          orderBy: { stepOrder: "asc" },
        },
      },
    });

    if (!request || request.status !== "PENDING") {
      return { success: false, error: "Request is not pending." };
    }

    const activeStep = request.steps.find((step) => step.status === "ACTIVE");

    if (!activeStep) {
      return { success: false, error: "No active approval step was found." };
    }

    if (
      !canDecideActiveStep(
        { id: actor.id, role: actor.role },
        {
          approverRole: activeStep.approverRole,
          approverUserId: activeStep.approverUserId,
          status: activeStep.status,
        },
      )
    ) {
      return { success: false, error: "You cannot decide this approval step." };
    }

    const decidedAt = new Date();
    const decidedStep = await transaction.approvalStep.updateMany({
      where: {
        id: activeStep.id,
        status: "ACTIVE",
      },
      data: {
        status: decision,
        decision,
        comment,
        decidedAt,
      },
    });

    if (decidedStep.count !== 1) {
      return {
        success: false,
        error: "This approval step was already decided. Refresh and try again.",
      };
    }

    if (decision === "REJECTED") {
      await transaction.approvalRequest.update({
        where: { id: request.id },
        data: {
          status: "REJECTED",
          currentStepOrder: null,
          finalDecisionAt: new Date(),
        },
      });
      await transaction.auditLog.create({
        data: {
          actorUserId: actor.id,
          action: "APPROVAL_REQUEST_REJECTED",
          entityType: "ApprovalRequest",
          entityId: request.id,
          newValueJson: toAuditJson({ stepId: activeStep.id, comment }),
        },
      });
      await notifyRequesterFinalState({
        requesterId: request.requesterId,
        requestId: request.id,
        status: "REJECTED",
        client: transaction,
      });
      return { success: true };
    }

    const outcome = resolveApprovalOutcome(request.steps);

    await transaction.auditLog.create({
      data: {
        actorUserId: actor.id,
        action: "APPROVAL_REQUEST_APPROVED",
        entityType: "ApprovalRequest",
        entityId: request.id,
        newValueJson: toAuditJson({ stepId: activeStep.id, comment }),
      },
    });

    if (outcome.completed) {
      await transaction.approvalRequest.update({
        where: { id: request.id },
        data: {
          status: "APPROVED",
          currentStepOrder: null,
          finalDecisionAt: new Date(),
        },
      });
      await transaction.auditLog.create({
        data: {
          actorUserId: actor.id,
          action: "APPROVAL_REQUEST_COMPLETED",
          entityType: "ApprovalRequest",
          entityId: request.id,
        },
      });
      await notifyRequesterFinalState({
        requesterId: request.requesterId,
        requestId: request.id,
        status: "APPROVED",
        client: transaction,
      });
      return { success: true };
    }

    await transaction.approvalStep.updateMany({
      where: {
        id: outcome.nextStepId ?? "",
        status: "WAITING",
      },
      data: { status: "ACTIVE" },
    });
    await transaction.approvalRequest.update({
      where: { id: request.id },
      data: { currentStepOrder: outcome.nextStepOrder },
    });

    const nextStep = request.steps.find((step) => step.id === outcome.nextStepId);
    if (nextStep) {
      await notifyApprovalStep({
        approverRole: nextStep.approverRole,
        approverUserId: nextStep.approverUserId,
        requestId: request.id,
        requestType: request.requestType,
        client: transaction,
      });
    }

    return { success: true };
  });
}
