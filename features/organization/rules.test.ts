import { describe, expect, it } from "vitest";
import {
  canMutateOrganization,
  hasDuplicateActivePrimaryAssignment,
  isAssignmentRoleCompatible,
  isManagerRelationRolePairAllowed,
} from "./rules";

describe("organization rules", () => {
  it("allows only Admin and Super Admin to mutate organization data", () => {
    expect(canMutateOrganization("ADMIN")).toBe(true);
    expect(canMutateOrganization("SUPER_ADMIN")).toBe(true);
    expect(canMutateOrganization("PICKER")).toBe(false);
    expect(canMutateOrganization("CHAMP")).toBe(false);
  });

  it("requires branch assignment role to match the user's role", () => {
    expect(isAssignmentRoleCompatible("PICKER", "PICKER")).toBe(true);
    expect(isAssignmentRoleCompatible("CHAMP", "CHAMP")).toBe(true);
    expect(isAssignmentRoleCompatible("ADMIN", "PICKER")).toBe(false);
    expect(isAssignmentRoleCompatible("PICKER", "CHAMP")).toBe(false);
  });

  it("detects duplicate active primary assignments for the same user and role", () => {
    expect(
      hasDuplicateActivePrimaryAssignment(
        [
          {
            userId: "user_1",
            roleAtBranch: "PICKER",
            status: "ACTIVE",
            isPrimary: true,
          },
        ],
        {
          userId: "user_1",
          roleAtBranch: "PICKER",
          isPrimary: true,
        },
      ),
    ).toBe(true);
  });

  it("allows only supported manager relation role pairs", () => {
    expect(isManagerRelationRolePairAllowed("CHAMP_TO_PICKER", "PICKER", "CHAMP")).toBe(true);
    expect(
      isManagerRelationRolePairAllowed("AREA_MANAGER_TO_CHAMP", "CHAMP", "AREA_MANAGER"),
    ).toBe(true);
    expect(isManagerRelationRolePairAllowed("CHAMP_TO_PICKER", "CHAMP", "PICKER")).toBe(false);
  });
});
