import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("auth page UX", () => {
  it("removes the old operations portal copy from the login page", () => {
    const content = readFileSync("app/(auth)/login/page.tsx", "utf8");

    expect(content).not.toContain("Operations Workforce Portal");
    expect(content).not.toContain("Sign in to manage Pickers");
    expect(content).not.toContain("Secure internal access");
    expect(content).toContain('title="Login"');
  });

  it("uses the same quiet auth shell for login and first password change", () => {
    const loginPage = readFileSync("app/(auth)/login/page.tsx", "utf8");
    const firstLoginPage = readFileSync("app/(auth)/first-login/page.tsx", "utf8");

    expect(loginPage).toContain("AuthShell");
    expect(firstLoginPage).toContain("AuthShell");
    expect(firstLoginPage).not.toContain("Create a strong password before continuing");
    expect(firstLoginPage).toContain('title="Change password"');
  });
});
