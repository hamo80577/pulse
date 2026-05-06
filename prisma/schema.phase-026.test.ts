import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const schema = readFileSync("prisma/schema.prisma", "utf8");
const userModel = schema.match(/\bmodel\s+User\s+\{[\s\S]*?\n\}/)?.[0] ?? "";

describe("Phase 2.6 Prisma schema", () => {
  it("keeps Phase 2.6 chain and branch external IDs in place", () => {
    expect(schema).toMatch(/\borderSystemChainId\s+String\?\s+@unique\b/);
    expect(schema).toMatch(/\borderSystemBranchId\s+String\?\s+@unique\b/);
  });

  it("adds nullable unique order-system IDs for future imports", () => {
    expect(schema).toMatch(/\borderSystemChainId\s+String\?\s+@unique\b/);
    expect(schema).toMatch(/\borderSystemBranchId\s+String\?\s+@unique\b/);
  });

  it("keeps employee external IDs scoped to EmployeeProfile", () => {
    expect(userModel).not.toMatch(/\bshopperId\s+String\?/);
    expect(userModel).not.toMatch(/\bibsId\s+String\?/);
  });
});
