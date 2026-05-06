import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const securityMigration = readFileSync(
  "prisma/migrations/20260506103000_phase_02_security_indexes/migration.sql",
  "utf8",
);

describe("database-level organization uniqueness indexes", () => {
  it("keeps one active primary BranchAssignment per user and role", () => {
    expect(securityMigration).toContain(
      '"BranchAssignment_one_active_primary_per_user_role"',
    );
    expect(securityMigration).toMatch(
      /ON\s+"BranchAssignment"\s+\("userId",\s*"roleAtBranch"\)/,
    );
    expect(securityMigration).toMatch(
      /WHERE\s+"status"\s*=\s*'ACTIVE'\s+AND\s+"isPrimary"\s*=\s*true/i,
    );
  });

  it("keeps one active ManagerRelation per employee and relation type", () => {
    expect(securityMigration).toContain(
      '"ManagerRelation_one_active_relation_per_employee_type"',
    );
    expect(securityMigration).toMatch(
      /ON\s+"ManagerRelation"\s+\("employeeUserId",\s*"relationType"\)/,
    );
    expect(securityMigration).toMatch(/WHERE\s+"status"\s*=\s*'ACTIVE'/i);
  });
});
