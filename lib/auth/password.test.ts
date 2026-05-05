import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password hashing", () => {
  it("verifies the original password", async () => {
    const hash = await hashPassword("StrongerPass1!");

    expect(hash).not.toContain("StrongerPass1!");
    await expect(verifyPassword("StrongerPass1!", hash)).resolves.toBe(true);
  });

  it("rejects a different password", async () => {
    const hash = await hashPassword("StrongerPass1!");

    await expect(verifyPassword("WrongPass1!", hash)).resolves.toBe(false);
  });
});
