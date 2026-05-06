import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Phase 4 approval routes", () => {
  it.each([
    "app/(dashboard)/requests/page.tsx",
    "app/(dashboard)/requests/new/page.tsx",
    "app/(dashboard)/requests/[requestId]/page.tsx",
    "app/(dashboard)/approvals/page.tsx",
    "app/(dashboard)/approvals/[requestId]/page.tsx",
    "app/(dashboard)/admin/approvals/page.tsx",
  ])("adds %s", (filePath) => {
    expect(existsSync(filePath)).toBe(true);
  });
});
