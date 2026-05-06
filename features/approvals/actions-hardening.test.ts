import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const actionsSource = readFileSync("features/approvals/actions.ts", "utf8");

describe("approval action hardening", () => {
  it("returns a user-facing error when approval cannot be applied", () => {
    expect(actionsSource).toMatch(
      /export\s+async\s+function\s+approveRequestAction[\s\S]*Promise<ApprovalActionState>/,
    );
    expect(actionsSource).toMatch(/if\s*\(!result\.success\)\s*\{/);
    expect(actionsSource).toContain("return { error: result.error }");
  });

  it("guards approval decisions with a conditional active-step update", () => {
    expect(actionsSource).toContain("approvalStep.updateMany");
    expect(actionsSource).toMatch(/where:\s*\{[\s\S]*id:\s*activeStep\.id[\s\S]*status:\s*"ACTIVE"/);
    expect(actionsSource).toMatch(/if\s*\(\s*decidedStep\.count\s*!==\s*1\s*\)/);
    expect(actionsSource).not.toMatch(
      /approvalStep\.update\(\s*\{\s*where:\s*\{\s*id:\s*activeStep\.id\s*\}/,
    );
  });
});
