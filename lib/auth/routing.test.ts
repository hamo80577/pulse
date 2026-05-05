import { describe, expect, it } from "vitest";
import {
  canAccessPath,
  getDashboardPathForRole,
  isBlockedStatus,
  requiresFirstLogin,
} from "./routing";

describe("auth routing", () => {
  it("maps each role to its dashboard route", () => {
    expect(getDashboardPathForRole("PICKER")).toBe("/picker");
    expect(getDashboardPathForRole("CHAMP")).toBe("/champ");
    expect(getDashboardPathForRole("AREA_MANAGER")).toBe("/area-manager");
    expect(getDashboardPathForRole("WORKFORCE_MANAGER")).toBe("/workforce");
    expect(getDashboardPathForRole("OPERATIONS_MANAGER")).toBe("/operations");
    expect(getDashboardPathForRole("SENIOR_OPERATIONS_MANAGER")).toBe(
      "/senior-operations",
    );
    expect(getDashboardPathForRole("ADMIN")).toBe("/admin");
    expect(getDashboardPathForRole("SUPER_ADMIN")).toBe("/super-admin");
  });

  it("blocks inactive lifecycle statuses from login", () => {
    expect(isBlockedStatus("ON_HOLD")).toBe(true);
    expect(isBlockedStatus("SUSPENDED")).toBe(true);
    expect(isBlockedStatus("RESIGNED")).toBe(true);
    expect(isBlockedStatus("DELETED")).toBe(true);
    expect(isBlockedStatus("ACTIVE")).toBe(false);
    expect(isBlockedStatus("PENDING_SETUP")).toBe(false);
  });

  it("requires first-login setup for pending users or forced password changes", () => {
    expect(requiresFirstLogin({ status: "PENDING_SETUP", mustChangePassword: false })).toBe(
      true,
    );
    expect(requiresFirstLogin({ status: "ACTIVE", mustChangePassword: true })).toBe(true);
    expect(requiresFirstLogin({ status: "ACTIVE", mustChangePassword: false })).toBe(false);
  });

  it("allows users to access only their own dashboard route", () => {
    expect(canAccessPath("PICKER", "/picker")).toBe(true);
    expect(canAccessPath("PICKER", "/champ")).toBe(false);
    expect(canAccessPath("CHAMP", "/admin")).toBe(false);
    expect(canAccessPath("PICKER", "/admin")).toBe(false);
  });

  it("allows Admin and Super Admin access to admin route families", () => {
    expect(canAccessPath("SUPER_ADMIN", "/admin")).toBe(true);
    expect(canAccessPath("SUPER_ADMIN", "/admin/organization")).toBe(true);
    expect(canAccessPath("SUPER_ADMIN", "/super-admin")).toBe(true);
    expect(canAccessPath("ADMIN", "/admin")).toBe(true);
    expect(canAccessPath("ADMIN", "/admin/organization")).toBe(true);
    expect(canAccessPath("ADMIN", "/super-admin")).toBe(false);
  });
});
