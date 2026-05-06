import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const organizationPage = "app/(dashboard)/admin/organization/page.tsx";
const branchDetailPage =
  "app/(dashboard)/admin/organization/branches/[branchId]/page.tsx";
const userDetailPage =
  "app/(dashboard)/admin/workforce/users/[userId]/page.tsx";
const userAssignmentForms =
  "features/users/components/user-assignment-forms.tsx";

describe("assignment profile UX correction", () => {
  it("keeps direct assignment creation forms out of the organization workbench", () => {
    const content = readFileSync(organizationPage, "utf8");

    expect(content).not.toContain("AssignmentForm");
    expect(content).not.toContain("ManagerRelationForm");
    expect(content).not.toContain('title="Assign People"');
    expect(content).not.toContain('title="Manager Relations"');
    expect(content).toContain("Assignments are managed from employee profiles.");
    expect(content).toContain("/admin/workforce");
    expect(content).toContain("/admin/organization/tree");
  });

  it("does not create assignments directly from branch detail", () => {
    const content = readFileSync(branchDetailPage, "utf8");

    expect(content).not.toContain("AssignmentForm");
    expect(content).toContain("Assign employee from Workforce");
  });

  it("adds assignment and manager relation sections to the user detail page", () => {
    const content = readFileSync(userDetailPage, "utf8");

    expect(content).toContain("getUserAssignmentSummary");
    expect(content).toContain("getUserAssignmentFormOptions");
    expect(content).toContain("AssignmentSummary");
  });

  it("renders user-profile assignment forms without employee/user dropdowns", () => {
    expect(existsSync(userAssignmentForms)).toBe(true);
    const content = readFileSync(userAssignmentForms, "utf8");

    expect(content).toContain('name="userId"');
    expect(content).toContain('type="hidden"');
    expect(content).toContain('name="employeeUserId"');
    expect(content).not.toContain('htmlFor="userId"');
    expect(content).not.toContain('htmlFor="employeeUserId"');
    expect(content).not.toContain("<option key={user.id} value={user.id}>");
  });
});
