import { describe, expect, it } from "vitest";
import {
  assertDemoSeedAllowed,
  buildDemoCredentialDocument,
  demoCredentialFilePath,
  demoUsers,
} from "./seed-demo-users";

describe("demo user seed", () => {
  it("refuses to run in production", () => {
    expect(() => assertDemoSeedAllowed("production")).toThrow(
      "Demo users seed cannot run in production.",
    );
  });

  it("writes credentials only to LOCAL_CREDENTIALS.md", () => {
    expect(demoCredentialFilePath).toBe("LOCAL_CREDENTIALS.md");

    const document = buildDemoCredentialDocument([
      { phone: "01000000004", password: "abc123", role: "PICKER" },
    ]);

    expect(document).toContain("LOCAL_CREDENTIALS.md");
    expect(document).toContain("01000000004");
    expect(document).toContain("abc123");
  });

  it("defines real demo roles with picker/champ external IDs", () => {
    expect(demoUsers.map((user) => user.role)).toEqual([
      "SUPER_ADMIN",
      "ADMIN",
      "AREA_MANAGER",
      "CHAMP",
      "PICKER",
    ]);
    expect(demoUsers.find((user) => user.role === "PICKER")?.profile).toMatchObject({
      shopperId: expect.any(String),
      ibsId: expect.any(String),
    });
    expect(demoUsers.find((user) => user.role === "CHAMP")?.profile).toMatchObject({
      shopperId: expect.any(String),
      ibsId: expect.any(String),
    });
  });
});
