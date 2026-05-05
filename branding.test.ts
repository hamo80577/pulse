import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const filesWithVisibleBranding = [
  "agent.md",
  "README.md",
  "docs/README.md",
  "docs/BLUEPRINT_SITEMAP.md",
  "docs/PHASES.md",
  "docs/specs/phase-00-project-bootstrap.md",
  "docs/specs/phase-01-auth-roles-protected-layouts.md",
  "docs/specs/phase-01-branding-ui-alignment.md",
  "app/layout.tsx",
  "app/page.tsx",
  "app/docs/page.tsx",
  "app/(auth)/login/page.tsx",
  "app/(auth)/first-login/page.tsx",
  "components/layout/app-shell.tsx",
  "components/layout/dashboard-shell.tsx",
  "components/dashboards/role-dashboard.tsx",
  ".env.example",
];

const legacyBrand = "Pl" + "us";
const legacySessionCookie = "pl" + "us_session";

describe("Pulse branding", () => {
  it.each(filesWithVisibleBranding)(
    "%s does not use legacy product branding",
    (filePath) => {
      const content = readFileSync(filePath, "utf8");

      expect(content).not.toContain(legacyBrand);
    },
  );

  it("uses the Pulse session cookie name", () => {
    const content = readFileSync("lib/auth/session.ts", "utf8");

    expect(content).toContain('"pulse_session"');
    expect(content).not.toContain(`"${legacySessionCookie}"`);
  });
});
