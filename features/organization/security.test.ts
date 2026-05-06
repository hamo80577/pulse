import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const organizationFiles = [
  "features/organization/queries.ts",
  "features/organization/actions.ts",
];

describe("organization query security", () => {
  it.each(organizationFiles)("%s does not include full user records", (filePath) => {
    const content = readFileSync(filePath, "utf8");

    expect(content).not.toMatch(/\buser:\s*true\b/);
    expect(content).not.toMatch(/\bcreatedBy:\s*true\b/);
    expect(content).not.toMatch(/\bemployee:\s*true\b/);
    expect(content).not.toMatch(/\bmanager:\s*true\b/);
  });

  it("uses explicit safe selects for organization user options", () => {
    const content = readFileSync("features/organization/queries.ts", "utf8");
    const userFindManyBlocks = content.match(
      /prisma\.user\.findMany\(\{[\s\S]*?\n    \}\),?/g,
    );

    expect(userFindManyBlocks?.length).toBeGreaterThan(0);
    for (const block of userFindManyBlocks ?? []) {
      expect(block).toContain("select: safeUserSelect");
    }
    expect(content).toContain("safeUserSelect");
  });

  it("does not expose sensitive auth fields from organization files", () => {
    const sensitiveFields = [
      "passwordHash",
      "sessions",
      "setupTokens",
      "mustChangePassword",
      "lastLoginAt",
      "email",
      "phone",
    ];

    for (const filePath of organizationFiles) {
      const content = readFileSync(filePath, "utf8");

      for (const field of sensitiveFields) {
        expect(content).not.toContain(field);
      }
    }
  });
});
