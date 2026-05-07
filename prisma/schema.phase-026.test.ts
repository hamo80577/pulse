import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const schema = readFileSync("prisma/schema.prisma", "utf8");
const userModel = schema.match(/\bmodel\s+User\s+\{[\s\S]*?\n\}/)?.[0] ?? "";

describe("Phase 2.6 Prisma schema", () => {
  it("keeps Phase 2.6 chain and branch external IDs in place", () => {
    expect(schema).toMatch(/\borderSystemChainId\s+String\s+@unique\b/);
    expect(schema).toMatch(/\borderSystemBranchId\s+String\s+@unique\b/);
  });

  it("requires chain and branch IDs", () => {
    expect(schema).toMatch(/\borderSystemChainId\s+String\s+@unique\b/);
    expect(schema).toMatch(/\borderSystemBranchId\s+String\s+@unique\b/);
  });

  it("does not keep the old chain code field", () => {
    const chainModel =
      schema.match(/\bmodel\s+Chain\s+\{[\s\S]*?\n\}/)?.[0] ?? "";

    expect(chainModel).not.toMatch(/\bcode\s+String/);
    expect(chainModel).not.toContain("@@unique([code])");
  });

  it("does not keep the old branch code field", () => {
    const branchModel =
      schema.match(/\bmodel\s+Branch\s+\{[\s\S]*?\n\}/)?.[0] ?? "";

    expect(branchModel).not.toMatch(/\bcode\s+String/);
    expect(branchModel).not.toContain("@@unique([code])");
  });

  it("keeps employee external IDs scoped to EmployeeProfile", () => {
    expect(userModel).not.toMatch(/\bshopperId\s+String\?/);
    expect(userModel).not.toMatch(/\bibsId\s+String\?/);
  });
});
