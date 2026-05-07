import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  endBranchAssignmentAction,
  endManagerRelationAction,
} from "@/features/organization/actions";
import type { UserDetail } from "../queries";
import {
  UserBranchAssignmentForm,
  UserManagerRelationForm,
} from "./user-assignment-forms";

type AssignmentSummaryProps = {
  summary: Awaited<ReturnType<typeof import("../queries").getUserAssignmentSummary>>;
  formOptions: Awaited<
    ReturnType<typeof import("../queries").getUserAssignmentFormOptions>
  >;
  user: UserDetail;
};

export function AssignmentSummary({
  summary,
  formOptions,
  user,
}: AssignmentSummaryProps) {
  const activeAssignment = summary.assignments.find(
    (assignment) => assignment.status === "ACTIVE",
  );
  const activeManager = summary.employeeRelations.find(
    (relation) => relation.status === "ACTIVE",
  );
  const activeReports = summary.managerRelations.filter(
    (relation) => relation.status === "ACTIVE",
  );

  return (
    <div className="grid gap-4">
      <div id="assignments">
        <SectionCard title="Assignments">
          {activeAssignment ? (
            <AssignmentRow assignment={activeAssignment} canEnd />
          ) : (
            <EmptyState title="No active branch assignment" />
          )}
        </SectionCard>
      </div>

      <SectionCard description="Create a new history row for this employee." title="Add Branch Assignment">
        <UserBranchAssignmentForm
          branches={formOptions.branches}
          managers={formOptions.managers}
          user={user}
        />
      </SectionCard>

      <SectionCard title="Assignment History">
        <div className="grid gap-3">
          {summary.assignments.length === 0 ? (
            <EmptyState title="No assignment history" />
          ) : (
            summary.assignments.map((assignment) => (
              <AssignmentRow assignment={assignment} key={assignment.id} />
            ))
          )}
        </div>
      </SectionCard>

      <div id="manager-relations">
        <SectionCard title="Manager Relations">
          {activeManager ? (
            <RelationRow relation={activeManager} direction="manager" canEnd />
          ) : (
            <EmptyState title="No active manager" />
          )}
        </SectionCard>
      </div>

      <SectionCard description="Choose an eligible active manager for this employee." title="Add Manager Relation">
        <UserManagerRelationForm
          branches={formOptions.branches}
          managers={formOptions.managers}
          user={user}
        />
      </SectionCard>

      <SectionCard title="Direct Reports">
        <div className="grid gap-3">
          {activeReports.length === 0 ? (
            <EmptyState title="No active direct reports" />
          ) : (
            activeReports.map((relation) => (
              <RelationRow
                direction="employee"
                key={relation.id}
                relation={relation}
              />
            ))
          )}
        </div>
      </SectionCard>

      <SectionCard title="Relation History">
        <div className="grid gap-3">
          {summary.managerRelations.length === 0 &&
          summary.employeeRelations.length === 0 ? (
            <EmptyState title="No manager relation history" />
          ) : (
            [...summary.employeeRelations, ...summary.managerRelations].map(
              (relation) => (
                <RelationRow
                  direction={"manager" in relation ? "manager" : "employee"}
                  key={relation.id}
                  relation={relation}
                />
              ),
            )
          )}
        </div>
      </SectionCard>
    </div>
  );
}

type Assignment = AssignmentSummaryProps["summary"]["assignments"][number];
type EmployeeRelation =
  AssignmentSummaryProps["summary"]["employeeRelations"][number];
type ManagerRelation =
  AssignmentSummaryProps["summary"]["managerRelations"][number];

function AssignmentRow({
  assignment,
  canEnd = false,
}: {
  assignment: Assignment;
  canEnd?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border p-3">
      <div>
        <p className="font-medium">
          {assignment.branch.chain.name} / {assignment.branch.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {assignment.roleAtBranch} / {assignment.isPrimary ? "Primary" : "Secondary"} /{" "}
          {formatDate(assignment.startDate)} - {formatDate(assignment.endDate)}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatOrderIds(
            assignment.branch.chain.orderSystemChainId,
            assignment.branch.orderSystemBranchId,
          )}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={assignment.status} />
        {canEnd && assignment.status === "ACTIVE" ? (
          <form action={endBranchAssignmentAction}>
            <input name="assignmentId" type="hidden" value={assignment.id} />
            <Button size="sm" type="submit" variant="outline">
              End active assignment
            </Button>
          </form>
        ) : null}
      </div>
    </div>
  );
}

function RelationRow({
  relation,
  direction,
  canEnd = false,
}: {
  relation: EmployeeRelation | ManagerRelation;
  direction: "manager" | "employee";
  canEnd?: boolean;
}) {
  const person =
    direction === "manager" && "manager" in relation
      ? relation.manager
      : direction === "employee" && "employee" in relation
        ? relation.employee
        : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border p-3">
      <div>
        <p className="font-medium">
          {person ? (
            <Link href={`/admin/workforce/users/${person.id}`}>
              {person.name}
            </Link>
          ) : (
            relation.relationType.replaceAll("_", " ")
          )}
        </p>
        <p className="text-sm text-muted-foreground">
          {relation.relationType.replaceAll("_", " ")} /{" "}
          {formatDate(relation.startDate)} - {formatDate(relation.endDate)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={relation.status} />
        {canEnd && relation.status === "ACTIVE" ? (
          <form action={endManagerRelationAction}>
            <input name="relationId" type="hidden" value={relation.id} />
            <Button size="sm" type="submit" variant="outline">
              End active relation
            </Button>
          </form>
        ) : null}
      </div>
    </div>
  );
}

function formatDate(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : "Current";
}

function formatOrderIds(chainId: string, branchId: string) {
  return `Chain ID: ${chainId} / Branch ID: ${branchId}`;
}
