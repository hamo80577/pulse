import type { Role } from "@/lib/auth/types";

export const approvalRequestTypes = [
  "ANNUAL_LEAVE",
  "ADD_PICKER",
  "ADD_CHAMP",
  "TRANSFER_PICKER_SAME_CHAIN",
  "TRANSFER_PICKER_CROSS_CHAIN",
  "RESIGNATION",
  "EMPLOYEE_DATA_UPDATE",
] as const;

export type ApprovalRequestTypeInput = (typeof approvalRequestTypes)[number];

export type WorkflowStepTemplate = {
  approverRole: Role;
  approverUserId?: string | null;
};

export type ApprovalStepApproverResolutionInput = {
  requestType: ApprovalRequestTypeInput;
  stepOrder: number;
  approverRole: Role;
  requesterId: string;
  targetUserId: string | null;
  payloadJson: unknown;
};

export type ApprovalStepApproverResolution = {
  approverUserId: string | null;
  fallbackToRole: boolean;
};

const workflowTemplates: Record<ApprovalRequestTypeInput, WorkflowStepTemplate[]> = {
  ANNUAL_LEAVE: [
    { approverRole: "CHAMP" },
    { approverRole: "AREA_MANAGER" },
    { approverRole: "ADMIN" },
  ],
  ADD_PICKER: [
    { approverRole: "AREA_MANAGER" },
    { approverRole: "ADMIN" },
  ],
  ADD_CHAMP: [
    { approverRole: "OPERATIONS_MANAGER" },
    { approverRole: "ADMIN" },
  ],
  TRANSFER_PICKER_SAME_CHAIN: [
    { approverRole: "AREA_MANAGER" },
    { approverRole: "ADMIN" },
  ],
  TRANSFER_PICKER_CROSS_CHAIN: [
    { approverRole: "AREA_MANAGER" },
    { approverRole: "AREA_MANAGER" },
    { approverRole: "ADMIN" },
    { approverRole: "SUPER_ADMIN" },
  ],
  RESIGNATION: [
    { approverRole: "AREA_MANAGER" },
    { approverRole: "ADMIN" },
  ],
  EMPLOYEE_DATA_UPDATE: [{ approverRole: "ADMIN" }],
};

export function getWorkflowTemplate(requestType: ApprovalRequestTypeInput) {
  return workflowTemplates[requestType];
}

export function resolveApprovalStepApprover(
  input: ApprovalStepApproverResolutionInput,
): ApprovalStepApproverResolution {
  void input;

  return {
    approverUserId: null,
    fallbackToRole: true,
  };
}

export function buildApprovalSteps(
  requestType: ApprovalRequestTypeInput,
  context?: {
    requesterId: string;
    targetUserId: string | null;
    payloadJson: unknown;
  },
) {
  return getWorkflowTemplate(requestType).map((step, index) => ({
    stepOrder: index + 1,
    approverRole: step.approverRole,
    approverUserId:
      step.approverUserId ??
      (context
        ? resolveApprovalStepApprover({
            requestType,
            stepOrder: index + 1,
            approverRole: step.approverRole,
            requesterId: context.requesterId,
            targetUserId: context.targetUserId,
            payloadJson: context.payloadJson,
          }).approverUserId
        : null),
    status: index === 0 ? ("ACTIVE" as const) : ("WAITING" as const),
  }));
}
