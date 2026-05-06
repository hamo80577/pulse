import { describe, expect, it } from "vitest";
import {
  approvalRequestTypes,
  buildApprovalSteps,
  getWorkflowTemplate,
} from "./workflows";

describe("approval workflow templates", () => {
  it("defines every initial request type", () => {
    expect(approvalRequestTypes).toEqual([
      "ANNUAL_LEAVE",
      "ADD_PICKER",
      "ADD_CHAMP",
      "TRANSFER_PICKER_SAME_CHAIN",
      "TRANSFER_PICKER_CROSS_CHAIN",
      "RESIGNATION",
      "EMPLOYEE_DATA_UPDATE",
    ]);
  });

  it("builds ordered steps with only the first step active", () => {
    const steps = buildApprovalSteps("ANNUAL_LEAVE");

    expect(steps).toMatchObject([
      { stepOrder: 1, approverRole: "CHAMP", status: "ACTIVE" },
      { stepOrder: 2, approverRole: "AREA_MANAGER", status: "WAITING" },
      { stepOrder: 3, approverRole: "ADMIN", status: "WAITING" },
    ]);
  });

  it("keeps future request types as generic templates", () => {
    expect(getWorkflowTemplate("TRANSFER_PICKER_CROSS_CHAIN").length).toBe(4);
    expect(getWorkflowTemplate("EMPLOYEE_DATA_UPDATE")).toEqual([
      { approverRole: "ADMIN" },
    ]);
  });
});
