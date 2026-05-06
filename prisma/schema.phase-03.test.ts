import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const schema = readFileSync("prisma/schema.prisma", "utf8");

describe("Phase 3 Prisma schema", () => {
  it("adds EmployeeProfile with unique nullable employee external IDs", () => {
    expect(schema).toMatch(/\benum\s+EmploymentStatus\b/);
    expect(schema).toMatch(/\bmodel\s+EmployeeProfile\b/);
    expect(schema).toMatch(/\buserId\s+String\s+@unique\b/);
    expect(schema).toMatch(/\bnationalId\s+String\?\s+@unique\b/);
    expect(schema).toMatch(/\bshopperId\s+String\?\s+@unique\b/);
    expect(schema).toMatch(/\bibsId\s+String\?\s+@unique\b/);
  });

  it("keeps file fields as URL placeholders only", () => {
    expect(schema).toMatch(/\bpersonalPhotoUrl\s+String\?/);
    expect(schema).toMatch(/\bidCardFrontUrl\s+String\?/);
    expect(schema).toMatch(/\bidCardBackUrl\s+String\?/);
    expect(schema).not.toMatch(/\bfileBlob\b|\bbytes\b/i);
  });
});
