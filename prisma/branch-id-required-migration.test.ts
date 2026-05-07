import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migrationPath =
  "prisma/migrations/20260507004000_branch_id_required_remove_branch_code/migration.sql";

describe("branch ID migration", () => {
  it("drops the old Branch code field and requires Branch ID", () => {
    expect(existsSync(migrationPath)).toBe(true);
    const migration = readFileSync(migrationPath, "utf8");

    expect(migration).toContain('DROP COLUMN "code"');
    expect(migration).toContain('ALTER COLUMN "orderSystemBranchId" SET NOT NULL');
    expect(migration).toContain('"Branch_code_key"');
  });
});
