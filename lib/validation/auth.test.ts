import { describe, expect, it } from "vitest";
import { hashPassword } from "../auth/password";
import {
  firstLoginSchema,
  loginSchema,
  validateFirstLoginInput,
} from "./auth";

describe("auth validation", () => {
  it("requires login credentials", () => {
    const result = loginSchema.safeParse({ phone: "", password: "" });

    expect(result.success).toBe(false);
  });

  it("accepts valid login credentials", () => {
    const result = loginSchema.safeParse({
      phone: " 01000000000 ",
      password: "abc123",
    });

    expect(result.success).toBe(true);
    expect(result.success ? result.data.phone : null).toBe("01000000000");
  });

  it("rejects first-login passwords shorter than 6 characters", () => {
    const result = firstLoginSchema.safeParse({
      token: "setup-token",
      password: "a1234",
      confirmPassword: "a1234",
    });

    expect(result.success).toBe(false);
  });

  it("rejects first-login passwords with symbols", () => {
    const result = firstLoginSchema.safeParse({
      token: "setup-token",
      password: "abc123!",
      confirmPassword: "abc123!",
    });

    expect(result.success).toBe(false);
  });

  it("requires first-login password confirmation to match", () => {
    const result = firstLoginSchema.safeParse({
      token: "setup-token",
      password: "abc123",
      confirmPassword: "abc124",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a 6-character alphanumeric first-login password", () => {
    const result = firstLoginSchema.safeParse({
      token: "setup-token",
      password: "abc123",
      confirmPassword: "abc123",
    });

    expect(result.success).toBe(true);
  });

  it("does not require symbols or mixed case for first-login passwords", () => {
    const result = firstLoginSchema.safeParse({
      token: "setup-token",
      password: "abcdef",
      confirmPassword: "abcdef",
    });

    expect(result.success).toBe(true);
  });

  it("rejects reusing the current authenticated password", async () => {
    const currentPasswordHash = await hashPassword("abc123");
    const result = await validateFirstLoginInput(
      {
        token: "setup-token",
        password: "abc123",
        confirmPassword: "abc123",
      },
      {
        currentPasswordHash,
      },
    );

    expect(result.success).toBe(false);
  });
});
