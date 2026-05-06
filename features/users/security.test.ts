import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const userFeatureFiles = [
  "features/users/queries.ts",
  "features/users/actions.ts",
  "features/users/mutations.ts",
];

describe("user management security", () => {
  it.each(userFeatureFiles)("%s does not include full unsafe relations", (filePath) => {
    const content = readFileSync(filePath, "utf8");

    expect(content).not.toMatch(/\buser:\s*true\b/);
    expect(content).not.toMatch(/\bsessions:\s*true\b/);
    expect(content).not.toMatch(/\bsetupTokens:\s*true\b/);
  });

  it("uses explicit user management selects", () => {
    const content = readFileSync("features/users/queries.ts", "utf8");

    expect(content).toContain("userListSelect");
    expect(content).toContain("userDetailSelect");
    expect(content).not.toContain("passwordHash: true");
    expect(content).not.toContain("tokenHash: true");
  });
});
