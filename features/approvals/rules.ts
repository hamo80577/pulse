import type { Role } from "@/lib/auth/types";

type Actor = {
  id: string;
  role: Role;
};

type ActiveStepLike = {
  approverRole: Role;
  approverUserId: string | null;
  status: "WAITING" | "ACTIVE" | "APPROVED" | "REJECTED" | "SKIPPED";
};

type RequestViewLike = {
  requesterId: string;
  targetUserId?: string | null;
  steps: ReadonlyArray<{
    approverRole: Role;
    approverUserId: string | null;
  }>;
};

type StepOutcomeLike = {
  id: string;
  stepOrder: number;
  status: "WAITING" | "ACTIVE" | "APPROVED" | "REJECTED" | "SKIPPED";
};

export function canManageApprovalQueue(role: Role) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function canDecideActiveStep(actor: Actor, step: ActiveStepLike) {
  if (step.status !== "ACTIVE") {
    return false;
  }

  return step.approverUserId
    ? step.approverUserId === actor.id
    : step.approverRole === actor.role;
}

export function canViewApprovalRequest(actor: Actor, request: RequestViewLike) {
  if (canManageApprovalQueue(actor.role)) {
    return true;
  }

  if (request.requesterId === actor.id || request.targetUserId === actor.id) {
    return true;
  }

  return request.steps.some(
    (step) =>
      step.approverUserId === actor.id ||
      (!step.approverUserId && step.approverRole === actor.role),
  );
}

export function resolveApprovalOutcome(steps: StepOutcomeLike[]) {
  const orderedSteps = [...steps].sort((left, right) => left.stepOrder - right.stepOrder);
  const activeStep = orderedSteps.find((step) => step.status === "ACTIVE");
  const nextStep = orderedSteps.find(
    (step) => step.status === "WAITING" && (!activeStep || step.stepOrder > activeStep.stepOrder),
  );

  if (!nextStep) {
    return {
      completed: true,
      nextStepId: null,
      nextStepOrder: null,
    };
  }

  return {
    completed: false,
    nextStepId: nextStep.id,
    nextStepOrder: nextStep.stepOrder,
  };
}
