import { describe, expect, it } from "vitest";
import { buildSuperAdminSeedData } from "./seed";

describe("Super Admin seed defaults", () => {
  it("forces the seeded Super Admin to change password by default", () => {
    const seedData = buildSuperAdminSeedData({
      phone: "01000000000",
      name: "Super Admin",
      email: "superadmin@example.com",
      passwordHash: "hash",
    });

    expect(seedData.where.phone).toBe("01000000000");
    expect(seedData.create.status).toBe("ACTIVE");
    expect(seedData.create.mustChangePassword).toBe(true);
    expect(seedData.update.mustChangePassword).toBe(true);
  });
});
