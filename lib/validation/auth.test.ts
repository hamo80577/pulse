import { describe, expect, it } from "vitest";
import { hashPassword } from "../auth/password";
import {
  firstLoginSchema,
  loginSchema,
  validateFirstLoginInput,
} from "./auth";

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

  it("rejects a first-login password that equals the username", async () => {
    const result = await validateFirstLoginInput(
      {
        token: "setup-token",
        password: "Superadmin1!",
        confirmPassword: "Superadmin1!",
      },
      {
        username: "superadmin1!",
      },
    );

    expect(result.success).toBe(false);
  });

  it("rejects reusing the current authenticated password", async () => {
    const currentPasswordHash = await hashPassword("CurrentPass1!");
    const result = await validateFirstLoginInput(
      {
        token: "setup-token",
        password: "CurrentPass1!",
        confirmPassword: "CurrentPass1!",
      },
      {
        username: "superadmin",
        currentPasswordHash,
      },
    );

    expect(result.success).toBe(false);
  });
});
