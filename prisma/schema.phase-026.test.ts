import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const schema = readFileSync("prisma/schema.prisma", "utf8");

describe("Phase 2.6 Prisma schema", () => {
  it("keeps EmployeeProfile out of Phase 2.6", () => {
    expect(schema).not.toMatch(/\bmodel\s+EmployeeProfile\b/);
  });

  it("adds nullable unique order-system IDs for future imports", () => {
    expect(schema).toMatch(/\borderSystemChainId\s+String\?\s+@unique\b/);
    expect(schema).toMatch(/\borderSystemBranchId\s+String\?\s+@unique\b/);
  });

  it("does not add employee external IDs before Phase 3", () => {
    expect(schema).not.toMatch(/\bshopperId\s+String\?/);
    expect(schema).not.toMatch(/\bibsId\s+String\?/);
  });
});
