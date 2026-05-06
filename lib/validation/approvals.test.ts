import { describe, expect, it } from "vitest";
import {
  approvalDecisionInputSchema,
  approvalRequestInputSchema,
} from "./approvals";

describe("approval validation", () => {
  it("accepts an annual leave proof request payload", () => {
    const result = approvalRequestInputSchema.safeParse({
      requestType: "ANNUAL_LEAVE",
      targetUserId: "",
      leaveDate: "2026-05-20",
      reason: "Personal appointment",
    });

    expect(result.success).toBe(true);
    expect(result.success ? result.data.payloadJson.reason : null).toBe(
      "Personal appointment",
    );
  });

  it("rejects invalid annual leave dates", () => {
    const result = approvalRequestInputSchema.safeParse({
      requestType: "ANNUAL_LEAVE",
      leaveDate: "not-a-date",
      reason: "Personal appointment",
    });

    expect(result.success).toBe(false);
  });

  it("requires a comment when rejecting", () => {
    const result = approvalDecisionInputSchema.safeParse({
      requestId: "request-1",
      comment: " ",
      decision: "REJECTED",
    });

    expect(result.success).toBe(false);
  });

  it("allows approval without a comment", () => {
    const result = approvalDecisionInputSchema.safeParse({
      requestId: "request-1",
      comment: "",
      decision: "APPROVED",
    });

    expect(result.success).toBe(true);
  });
});
