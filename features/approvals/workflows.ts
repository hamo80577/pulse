import type { Role } from "@/lib/auth/types";
import type { ApprovalRequestTypeInput } from "@/lib/validation/approvals";

export const approvalRequestTypes = [
  "ANNUAL_LEAVE",
  "ADD_PICKER",
  "ADD_CHAMP",
  "TRANSFER_PICKER_SAME_CHAIN",
  "TRANSFER_PICKER_CROSS_CHAIN",
  "RESIGNATION",
  "EMPLOYEE_DATA_UPDATE",
] as const;

export type WorkflowStepTemplate = {
  approverRole: Role;
  approverUserId?: string | null;
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

export function buildApprovalSteps(requestType: ApprovalRequestTypeInput) {
  return getWorkflowTemplate(requestType).map((step, index) => ({
    stepOrder: index + 1,
    approverRole: step.approverRole,
    approverUserId: step.approverUserId ?? null,
    status: index === 0 ? ("ACTIVE" as const) : ("WAITING" as const),
  }));
}
