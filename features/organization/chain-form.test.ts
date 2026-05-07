import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("chain form fields", () => {
  it("uses required Chain ID copy and removes the old code field", () => {
    const content = readFileSync(
      "features/organization/components/chain-form.tsx",
      "utf8",
    );

    expect(content).toContain(">Chain ID<");
    expect(content).toMatch(/name="orderSystemChainId"[\s\S]*required/);
    expect(content).not.toContain(">Code<");
    expect(content).not.toContain('name="code"');
    expect(content).not.toContain("Order System Chain ID");
  });
});
