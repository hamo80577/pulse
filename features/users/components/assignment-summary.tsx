import { EmptyState } from "@/components/ui/empty-state";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";

type AssignmentSummaryProps = {
  summary: Awaited<ReturnType<typeof import("../queries").getUserAssignmentSummary>>;
};

export function AssignmentSummary({ summary }: AssignmentSummaryProps) {
  const empty =
    summary.assignments.length === 0 &&
    summary.managerRelations.length === 0 &&
    summary.employeeRelations.length === 0;

  if (empty) {
    return (
      <EmptyState
        description="Assignments are managed from the organization workbench."
        title="No assignment history"
      />
    );
  }

  return (
    <div className="grid gap-4">
      <SectionCard title="Branch Assignments">
        <div className="grid gap-3">
          {summary.assignments.map((assignment) => (
            <div className="flex items-center justify-between rounded-md border p-3" key={assignment.id}>
              <div>
                <p className="font-medium">
                  {assignment.branch.chain.name} / {assignment.branch.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {assignment.roleAtBranch}
                </p>
              </div>
              <StatusBadge status={assignment.status} />
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Manager Relations">
        <div className="grid gap-3">
          {[...summary.managerRelations, ...summary.employeeRelations].map((relation) => (
            <div className="flex items-center justify-between rounded-md border p-3" key={relation.id}>
              <p className="font-medium">{relation.relationType.replaceAll("_", " ")}</p>
              <StatusBadge status={relation.status} />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
