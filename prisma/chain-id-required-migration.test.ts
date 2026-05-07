import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migrationPath =
  "prisma/migrations/20260507003000_chain_id_required_remove_chain_code/migration.sql";

describe("chain ID migration", () => {
  it("drops the old Chain code field and requires Chain ID", () => {
    expect(existsSync(migrationPath)).toBe(true);
    const migration = readFileSync(migrationPath, "utf8");

    expect(migration).toContain('DROP COLUMN "code"');
    expect(migration).toContain('ALTER COLUMN "orderSystemChainId" SET NOT NULL');
    expect(migration).toContain('"Chain_code_key"');
  });
});
