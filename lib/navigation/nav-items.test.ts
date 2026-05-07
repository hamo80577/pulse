import { describe, expect, it } from "vitest";
import { getAdminNavItems } from "./nav-items";

describe("ERP navigation items", () => {
  it("uses serializable icon keys for server-to-client navigation props", () => {
    const items = getAdminNavItems("ADMIN");

    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(typeof item.icon).toBe("string");
    }
  });

  it("links settings only to implemented route families", () => {
    const adminSettings = getAdminNavItems("ADMIN").find(
      (item) => item.label === "Settings",
    );
    const superAdminSettings = getAdminNavItems("SUPER_ADMIN").find(
      (item) => item.label === "Settings",
    );

    expect(adminSettings?.href).toBe("/admin/settings");
    expect(adminSettings?.comingSoon).toBeUndefined();
    expect(superAdminSettings?.href).toBe("/super-admin/settings");
    expect(superAdminSettings?.comingSoon).toBeUndefined();
  });

  it("links Users to the implemented admin user management route", () => {
    const users = getAdminNavItems("SUPER_ADMIN").find(
      (item) => item.label === "Users",
    );

    expect(users?.href).toBe("/admin/workforce/users");
    expect(users?.comingSoon).toBeUndefined();
  });
});
