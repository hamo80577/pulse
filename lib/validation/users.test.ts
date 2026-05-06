import { describe, expect, it } from "vitest";
import {
  profileInputSchema,
  userCreateInputSchema,
  userUpdateInputSchema,
} from "./users";

describe("user and employee profile validation", () => {
  it("validates user creation and normalizes optional strings", () => {
    const parsed = userCreateInputSchema.safeParse({
      name: "  Demo Picker  ",
      username: " picker.demo ",
      email: "",
      phone: "  ",
      role: "PICKER",
      status: "ACTIVE",
      nationalId: " NAT-1 ",
      shopperId: " SHOP-1 ",
      ibsId: " IBS-1 ",
      address: "",
      hireDate: "",
      employmentStatus: "ACTIVE",
    });

    expect(parsed.success).toBe(true);
    expect(parsed.success ? parsed.data : null).toMatchObject({
      name: "Demo Picker",
      username: "picker.demo",
      email: null,
      phone: null,
      nationalId: "NAT-1",
      shopperId: "SHOP-1",
      ibsId: "IBS-1",
      address: null,
      hireDate: null,
      employmentStatus: "ACTIVE",
    });
  });

  it("rejects invalid roles and employment statuses", () => {
    expect(
      userCreateInputSchema.safeParse({
        name: "User",
        username: "user",
        role: "INTERN",
        status: "ACTIVE",
        employmentStatus: "ACTIVE",
      }).success,
    ).toBe(false);
    expect(profileInputSchema.safeParse({ employmentStatus: "UNKNOWN" }).success).toBe(
      false,
    );
  });

  it("validates profile updates independently from auth fields", () => {
    const parsed = userUpdateInputSchema.safeParse({
      name: "Area Manager",
      username: "area.manager",
      email: "area@example.com",
      phone: "",
      role: "AREA_MANAGER",
      status: "ACTIVE",
      nationalId: "",
      shopperId: "",
      ibsId: " IBS-9 ",
      address: " Cairo ",
      hireDate: "2026-05-06",
      employmentStatus: "ACTIVE",
    });

    expect(parsed.success).toBe(true);
    expect(parsed.success ? parsed.data : null).toMatchObject({
      phone: null,
      nationalId: null,
      shopperId: null,
      ibsId: "IBS-9",
      address: "Cairo",
      hireDate: "2026-05-06",
    });
  });
});
