import { describe, expect, it } from "vitest";
import {
  canDecideActiveStep,
  canViewApprovalRequest,
  resolveApprovalOutcome,
} from "./rules";

describe("approval rules", () => {
  it("allows only the active step role or assigned approver to decide", () => {
    expect(
      canDecideActiveStep(
        { id: "champ-1", role: "CHAMP" },
        { approverRole: "CHAMP", approverUserId: null, status: "ACTIVE" },
      ),
    ).toBe(true);
    expect(
      canDecideActiveStep(
        { id: "picker-1", role: "PICKER" },
        { approverRole: "CHAMP", approverUserId: null, status: "ACTIVE" },
      ),
    ).toBe(false);
    expect(
      canDecideActiveStep(
        { id: "specific-admin", role: "ADMIN" },
        {
          approverRole: "SUPER_ADMIN",
          approverUserId: "specific-admin",
          status: "ACTIVE",
        },
      ),
    ).toBe(true);
  });

  it("lets request participants and admins view request details", () => {
    const request = {
      requesterId: "requester",
      targetUserId: "target",
      steps: [{ approverRole: "CHAMP", approverUserId: null }],
    } as const;

    expect(canViewApprovalRequest({ id: "requester", role: "PICKER" }, request)).toBe(true);
    expect(canViewApprovalRequest({ id: "target", role: "PICKER" }, request)).toBe(true);
    expect(canViewApprovalRequest({ id: "admin", role: "ADMIN" }, request)).toBe(true);
    expect(canViewApprovalRequest({ id: "other", role: "PICKER" }, request)).toBe(false);
  });

  it("advances to the next waiting step or completes on final approval", () => {
    expect(
      resolveApprovalOutcome([
        { id: "step-1", stepOrder: 1, status: "ACTIVE" },
        { id: "step-2", stepOrder: 2, status: "WAITING" },
      ]),
    ).toEqual({ completed: false, nextStepId: "step-2", nextStepOrder: 2 });

    expect(
      resolveApprovalOutcome([
        { id: "step-1", stepOrder: 1, status: "ACTIVE" },
      ]),
    ).toEqual({ completed: true, nextStepId: null, nextStepOrder: null });
  });
});
