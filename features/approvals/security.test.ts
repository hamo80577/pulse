import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const approvalFiles = [
  "features/approvals/queries.ts",
  "features/approvals/actions.ts",
];

describe("approval feature security", () => {
  it.each(approvalFiles)("%s avoids unsafe full user relations", (filePath) => {
    expect(existsSync(filePath)).toBe(true);
    const content = readFileSync(filePath, "utf8");

    expect(content).not.toMatch(/\buser:\s*true\b/);
    expect(content).not.toMatch(/\brequester:\s*true\b/);
    expect(content).not.toMatch(/\btargetUser:\s*true\b/);
    expect(content).not.toMatch(/\bapprover:\s*true\b/);
    expect(content).not.toContain("passwordHash");
    expect(content).not.toContain("tokenHash");
  });

  it("uses explicit approval query selects", () => {
    const content = readFileSync("features/approvals/queries.ts", "utf8");

    expect(content).toContain("approvalRequestListSelect");
    expect(content).toContain("approvalRequestDetailSelect");
    expect(content).toContain("approvalStepSelect");
  });
});
