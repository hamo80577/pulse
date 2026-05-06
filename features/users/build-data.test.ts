import { describe, expect, it } from "vitest";
import {
  buildCreateUserData,
  buildEmployeeProfileAuditMetadata,
} from "./mutations";

describe("user mutation data", () => {
  it("creates users with forced password change and profile data", () => {
    const data = buildCreateUserData({
      input: {
        name: "Picker One",
        email: null,
        phone: "01000000008",
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

  it("uses the saved profile id when an upsert creates a profile", () => {
    const metadata = buildEmployeeProfileAuditMetadata({
      existingProfile: null,
      savedProfile: {
        id: "profile-created",
        userId: "user-1",
        nationalId: null,
        shopperId: "SHOP-1",
        ibsId: null,
        address: null,
        personalPhotoUrl: null,
        idCardFrontUrl: null,
        idCardBackUrl: null,
        hireDate: null,
        employmentStatus: "ACTIVE",
        createdAt: new Date("2026-05-06T00:00:00.000Z"),
        updatedAt: new Date("2026-05-06T00:00:00.000Z"),
      },
    });

    expect(metadata.action).toBe("EMPLOYEE_PROFILE_CREATED");
    expect(metadata.entityId).toBe("profile-created");
  });
});
