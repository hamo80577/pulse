import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const settingsPages = [
  {
    path: "app/(dashboard)/admin/settings/page.tsx",
    guard: 'requireRole("ADMIN", "/admin/settings")',
  },
  {
    path: "app/(dashboard)/admin/settings/preferences/page.tsx",
    guard: 'requireRole("ADMIN", "/admin/settings/preferences")',
  },
  {
    path: "app/(dashboard)/super-admin/settings/page.tsx",
    guard: 'requireRole("SUPER_ADMIN", "/super-admin/settings")',
  },
  {
    path: "app/(dashboard)/super-admin/settings/preferences/page.tsx",
    guard: 'requireRole("SUPER_ADMIN", "/super-admin/settings/preferences")',
  },
];

describe("settings routes", () => {
  it.each(settingsPages)("$path exists and is protected", ({ path, guard }) => {
    expect(existsSync(path)).toBe(true);

    const content = readFileSync(path, "utf8");
    expect(content).toContain("ErpShell");
    expect(content).toContain(guard);
  });
});
