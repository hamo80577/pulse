import { describe, expect, it } from "vitest";
import { firstLoginSchema, loginSchema } from "./auth";

describe("auth validation", () => {
  it("requires login credentials", () => {
    const result = loginSchema.safeParse({ username: "", password: "" });

    expect(result.success).toBe(false);
  });

  it("accepts valid login credentials", () => {
    const result = loginSchema.safeParse({
      username: "superadmin",
      password: "StrongerPass1!",
    });

    expect(result.success).toBe(true);
  });

  it("rejects weak first-login passwords", () => {
    const result = firstLoginSchema.safeParse({
      token: "setup-token",
      password: "password",
      confirmPassword: "password",
    });

    expect(result.success).toBe(false);
  });

  it("requires first-login password confirmation to match", () => {
    const result = firstLoginSchema.safeParse({
      token: "setup-token",
      password: "StrongerPass1!",
      confirmPassword: "StrongerPass2!",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a strong matching first-login password", () => {
    const result = firstLoginSchema.safeParse({
      token: "setup-token",
      password: "StrongerPass1!",
      confirmPassword: "StrongerPass1!",
    });

    expect(result.success).toBe(true);
  });
});
