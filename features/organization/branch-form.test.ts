import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("branch form fields", () => {
  it("uses required Branch ID copy and removes the old code field", () => {
    const content = readFileSync(
      "features/organization/components/branch-form.tsx",
      "utf8",
    );

    expect(content).toContain(">Branch ID<");
    expect(content).toMatch(/name="orderSystemBranchId"[\s\S]*required/);
    expect(content).not.toContain(">Code<");
    expect(content).not.toContain('name="code"');
    expect(content).not.toContain("Order System Branch ID");
  });
});
