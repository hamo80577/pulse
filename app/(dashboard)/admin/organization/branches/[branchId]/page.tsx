import Link from "next/link";
import { notFound } from "next/navigation";
import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { BranchForm } from "@/features/organization/components/branch-form";
import { AssignmentForm } from "@/features/organization/components/assignment-form";
import { endBranchAssignmentAction } from "@/features/organization/actions";
import {
  getAssignmentFormOptions,
  getBranchDetail,
  getBranchFormOptions,
} from "@/features/organization/queries";
import { requireRole } from "@/lib/auth/session";

export default async function BranchDetailPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  const session = await requireRole(
    "ADMIN",
    `/admin/organization/branches/${branchId}`,
  );
  const [branch, branchOptions, assignmentOptions] = await Promise.all([
    getBranchDetail(branchId),
    getBranchFormOptions(),
    getAssignmentFormOptions(),
  ]);

  if (!branch) {
    notFound();
  }

  return (
    <ErpShell user={session.user}>
        <PageHeader
          actions={
          <Button asChild variant="outline">
          <Link href="/admin/organization/branches">Back to branches</Link>
        </Button>
          }
          description={
            branch.orderSystemBranchId
              ? `${branch.chain.name} / Order ID: ${branch.orderSystemBranchId}`
              : branch.chain.name
          }
          title={branch.name}
        />
        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionCard description="Update branch status or address." title="Branch Details">
              <BranchForm branch={branch} chains={branchOptions.chains} />
          </SectionCard>
          <SectionCard
            description="Existing active Pickers and Champs only."
            title="Assign Person"
          >
              <AssignmentForm
                branches={assignmentOptions.branches}
                defaultBranchId={branch.id}
                users={assignmentOptions.users}
              />
          </SectionCard>
        </section>
        <SectionCard
          description="End an active assignment before replacement."
          title="Assignment History"
        >
            {branch.assignments.length === 0 ? (
              <EmptyState title="No assignments for this branch" />
            ) : (
              <div className="grid gap-3">
                {branch.assignments.map((assignment) => (
                  <div
                    className="flex items-center justify-between gap-4 rounded-md border p-4"
                    key={assignment.id}
                  >
                    <div>
                      <p className="font-medium">{assignment.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.roleAtBranch} / {assignment.status}
                      </p>
                    </div>
                    <StatusBadge status={assignment.status} />
                    {assignment.status === "ACTIVE" ? (
                      <form action={endBranchAssignmentAction}>
                        <input
                          name="assignmentId"
                          type="hidden"
                          value={assignment.id}
                        />
                        <Button size="sm" type="submit" variant="outline">
                          End assignment
                        </Button>
                      </form>
                    ) : (
                      <span className="text-sm text-muted-foreground">Ended</span>
                    )}
                  </div>
                ))}
              </div>
            )}
        </SectionCard>
    </ErpShell>
  );
}
