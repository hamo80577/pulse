import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migrationPath =
  "prisma/migrations/20260507002000_phase_04_approval_queue_indexes/migration.sql";

describe("Phase 4 approval queue indexes", () => {
  it("adds compound indexes used by bounded approval queues", () => {
    expect(existsSync(migrationPath)).toBe(true);
    const migration = readFileSync(migrationPath, "utf8");

    expect(migration).toContain('"ApprovalRequest_status_createdAt_idx"');
    expect(migration).toMatch(/ON\s+"ApprovalRequest"\s*\("status",\s*"createdAt"\)/);
    expect(migration).toContain('"ApprovalRequest_requesterId_createdAt_idx"');
    expect(migration).toMatch(/ON\s+"ApprovalRequest"\s*\("requesterId",\s*"createdAt"\)/);
    expect(migration).toContain('"ApprovalStep_status_approverRole_idx"');
    expect(migration).toMatch(/ON\s+"ApprovalStep"\s*\("status",\s*"approverRole"\)/);
    expect(migration).toContain('"ApprovalStep_status_approverUserId_idx"');
    expect(migration).toMatch(/ON\s+"ApprovalStep"\s*\("status",\s*"approverUserId"\)/);
  });
});
