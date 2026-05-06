import { describe, expect, it } from "vitest";
import { canManageUsers } from "./permissions";

describe("user management permissions", () => {
  it("allows only Admin and Super Admin to manage users", () => {
    expect(canManageUsers("ADMIN")).toBe(true);
    expect(canManageUsers("SUPER_ADMIN")).toBe(true);
    expect(canManageUsers("PICKER")).toBe(false);
    expect(canManageUsers("CHAMP")).toBe(false);
  });
});
