import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const sessionSource = readFileSync("lib/auth/session.ts", "utf8");

describe("session security", () => {
  it("resolves current sessions with an explicit safe user select", () => {
    expect(sessionSource).not.toMatch(/include:\s*\{\s*user:\s*true\s*,?\s*\}/);
    expect(sessionSource).toContain("select: sessionSelect");
    expect(sessionSource).toContain("select: safeSessionUserSelect");
  });

  it("does not select sensitive auth fields for the session user", () => {
    const safeSelect =
      sessionSource.match(/const safeSessionUserSelect[\s\S]*?\} satisfies/)?.[0] ??
      "";

    expect(safeSelect).toContain("id: true");
    expect(safeSelect).toContain("name: true");
    expect(safeSelect).toContain("role: true");
    expect(safeSelect).toContain("status: true");
    expect(safeSelect).toContain("mustChangePassword: true");
    expect(safeSelect).not.toContain("passwordHash");
    expect(safeSelect).not.toContain("sessions");
    expect(safeSelect).not.toContain("setupTokens");
    expect(safeSelect).not.toContain("tokenHash");
  });
});
