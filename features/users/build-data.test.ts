import { describe, expect, it } from "vitest";
import { buildCreateUserData } from "./mutations";

describe("user mutation data", () => {
  it("creates users with forced password change and profile data", () => {
    const data = buildCreateUserData({
      input: {
        name: "Picker One",
        username: "picker.one",
        email: null,
        phone: null,
        role: "PICKER",
        status: "ACTIVE",
        nationalId: null,
        shopperId: "SHOP-1",
        ibsId: "IBS-1",
        address: null,
        hireDate: null,
        employmentStatus: "ACTIVE",
      },
      passwordHash: "hashed",
    });

    expect(data.mustChangePassword).toBe(true);
    expect(data.passwordHash).toBe("hashed");
    expect(data.employeeProfile.create).toMatchObject({
      shopperId: "SHOP-1",
      ibsId: "IBS-1",
    });
  });
});
