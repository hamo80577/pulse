import { describe, expect, it } from "vitest";
import {
  branchAssignmentInputSchema,
  branchInputSchema,
  chainInputSchema,
  managerRelationInputSchema,
} from "./organization";

describe("organization validation", () => {
  it("requires a chain name and normalizes an optional code", () => {
    const parsed = chainInputSchema.safeParse({
      name: "  North Cairo  ",
      code: " nc ",
      status: "ACTIVE",
    });

    expect(parsed.success).toBe(true);
    expect(parsed.success ? parsed.data : null).toEqual({
      name: "North Cairo",
      code: "NC",
      status: "ACTIVE",
    });
  });

  it("rejects a branch without a chain", () => {
    const parsed = branchInputSchema.safeParse({
      name: "Branch A",
      chainId: "",
      status: "ACTIVE",
    });

    expect(parsed.success).toBe(false);
  });

  it("accepts picker and champ branch assignments only", () => {
    const pickerParsed = branchAssignmentInputSchema.safeParse({
      userId: "user_1",
      branchId: "branch_1",
      roleAtBranch: "PICKER",
      startDate: "2026-05-06",
      isPrimary: true,
    });
    const managerParsed = branchAssignmentInputSchema.safeParse({
      userId: "user_2",
      branchId: "branch_1",
      roleAtBranch: "ADMIN",
      startDate: "2026-05-06",
      isPrimary: true,
    });

    expect(pickerParsed.success).toBe(true);
    expect(managerParsed.success).toBe(false);
  });

  it("rejects manager relations with the same employee and manager", () => {
    const parsed = managerRelationInputSchema.safeParse({
      employeeUserId: "user_1",
      managerUserId: "user_1",
      relationType: "CHAMP_TO_PICKER",
      startDate: "2026-05-06",
    });

    expect(parsed.success).toBe(false);
  });
});
