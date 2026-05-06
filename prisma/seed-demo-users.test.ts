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
      { username: "demo", password: "Secret1!", role: "PICKER" },
    ]);

    expect(document).toContain("LOCAL_CREDENTIALS.md");
    expect(document).toContain("demo");
    expect(document).toContain("Secret1!");
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
