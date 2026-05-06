import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const schema = readFileSync("prisma/schema.prisma", "utf8");

describe("Phase 4 Prisma schema", () => {
  it("adds generic approval engine enums and models", () => {
    expect(schema).toMatch(/\benum\s+ApprovalRequestType\b/);
    expect(schema).toMatch(/\benum\s+ApprovalRequestStatus\b/);
    expect(schema).toMatch(/\benum\s+ApprovalStepStatus\b/);
    expect(schema).toMatch(/\benum\s+ApprovalDecision\b/);
    expect(schema).toMatch(/\bmodel\s+ApprovalRequest\b/);
    expect(schema).toMatch(/\bmodel\s+ApprovalStep\b/);
  });

  it("adds minimal notifications for approval events", () => {
    expect(schema).toMatch(/\benum\s+NotificationType\b/);
    expect(schema).toMatch(/\bmodel\s+Notification\b/);
    expect(schema).toMatch(/\bisRead\s+Boolean\s+@default\(false\)/);
  });

  it("keeps approval request payloads generic JSON", () => {
    expect(schema).toMatch(/\bpayloadJson\s+Json\b/);
    expect(schema).not.toMatch(/\bAnnualLeaveRequest\b/);
    expect(schema).not.toMatch(/\bTransferRequest\b/);
  });
});
