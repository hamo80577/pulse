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
});
