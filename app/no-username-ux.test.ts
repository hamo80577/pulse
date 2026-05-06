import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const visibleUxFiles = [
  "components/auth/login-form.tsx",
  "components/layout/topbar.tsx",
  "features/users/components/user-form.tsx",
  "features/users/components/user-list.tsx",
  "features/users/components/user-filters.tsx",
  "features/users/components/user-detail.tsx",
  "app/(dashboard)/admin/workforce/users/[userId]/page.tsx",
];

describe("no username UX", () => {
  it.each(visibleUxFiles)("%s does not render or request usernames", (filePath) => {
    const content = readFileSync(filePath, "utf8");

    expect(content).not.toMatch(/username/i);
  });

  it("login form asks for phone number", () => {
    const content = readFileSync("components/auth/login-form.tsx", "utf8");

    expect(content).toContain("Phone");
    expect(content).toContain('name="phone"');
    expect(content).toContain('autoComplete="tel"');
  });
});
