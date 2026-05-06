import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getDatabaseUrl } from "./database-url";

describe("database URL configuration", () => {
  it("requires DATABASE_URL at runtime", () => {
    expect(() => getDatabaseUrl({})).toThrow("DATABASE_URL is required.");
  });

  it("uses the configured DATABASE_URL", () => {
    expect(
      getDatabaseUrl({
        DATABASE_URL: "postgresql://pulse:test@localhost:5432/pulse",
      }),
    ).toBe("postgresql://pulse:test@localhost:5432/pulse");
  });

  it("does not keep a silent local fallback in the Prisma runtime client", () => {
    const content = readFileSync("lib/db/prisma.ts", "utf8");

    expect(content).not.toContain("replace-with-a-local-password");
    expect(content).not.toMatch(/DATABASE_URL\s*\?\?/);
  });
});
