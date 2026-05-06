import { z } from "zod";
import { approvalRequestTypes } from "../../features/approvals/workflows";

const dateOnlySchema = z.string().trim().refine((value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}, "Enter a valid date.");

export const approvalRequestTypeSchema = z.enum(approvalRequestTypes);

export const approvalRequestInputSchema = z
  .object({
    requestType: approvalRequestTypeSchema,
    targetUserId: z.string().trim().optional(),
    leaveDate: dateOnlySchema,
    reason: z.string().trim().min(3, "Reason is required."),
  })
  .transform((input) => ({
    requestType: input.requestType,
    targetUserId: input.targetUserId ? input.targetUserId : null,
    payloadJson: {
      leaveDate: input.leaveDate,
      reason: input.reason,
    },
  }));

export const approvalDecisionInputSchema = z
  .object({
    requestId: z.string().trim().min(1, "Request is required."),
    decision: z.enum(["APPROVED", "REJECTED"]),
    comment: z.string().trim().optional(),
  })
  .superRefine((input, context) => {
    if (input.decision === "REJECTED" && !input.comment) {
      context.addIssue({
        code: "custom",
        message: "Rejection comment is required.",
        path: ["comment"],
      });
    }
  })
  .transform((input) => ({
    ...input,
    comment: input.comment || null,
  }));

export const cancelApprovalRequestInputSchema = z.object({
  requestId: z.string().trim().min(1, "Request is required."),
});

export type ApprovalRequestTypeInput = z.infer<typeof approvalRequestTypeSchema>;
export type ApprovalRequestInput = z.infer<typeof approvalRequestInputSchema>;
export type ApprovalDecisionInput = z.infer<typeof approvalDecisionInputSchema>;
