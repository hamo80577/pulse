import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workforcePages = [
  "app/(dashboard)/admin/workforce/page.tsx",
  "app/(dashboard)/admin/workforce/users/page.tsx",
  "app/(dashboard)/admin/workforce/users/new/page.tsx",
  "app/(dashboard)/admin/workforce/users/[userId]/page.tsx",
  "app/(dashboard)/admin/workforce/users/[userId]/profile/page.tsx",
  "app/(dashboard)/admin/workforce/users/[userId]/assignments/page.tsx",
];

describe("workforce routes", () => {
  it.each(workforcePages)("%s exists and uses the ERP shell", (pagePath) => {
    expect(existsSync(pagePath)).toBe(true);
    const content = readFileSync(pagePath, "utf8");
    expect(content).toContain("ErpShell");
    expect(content).toContain("requireRole");
  });

  it("keeps legacy admin users route as a redirect", () => {
    const redirectPath = "app/(dashboard)/admin/users/page.tsx";

    expect(existsSync(redirectPath)).toBe(true);
    expect(readFileSync(redirectPath, "utf8")).toContain("/admin/workforce/users");
  });
});
