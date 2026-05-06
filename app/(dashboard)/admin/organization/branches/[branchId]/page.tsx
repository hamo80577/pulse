import Link from "next/link";
import { notFound } from "next/navigation";
import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { BranchForm } from "@/features/organization/components/branch-form";
import {
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
  const [branch, branchOptions] = await Promise.all([
    getBranchDetail(branchId),
    getBranchFormOptions(),
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
            description="Assignments are managed from employee profiles."
            title="Assigned Employees"
            action={
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/workforce/users">Assign employee from Workforce</Link>
              </Button>
            }
          >
            <div className="grid gap-3">
              {branch.assignments.filter((assignment) => assignment.status === "ACTIVE").length === 0 ? (
                <EmptyState title="No active employees assigned" />
              ) : (
                branch.assignments
                  .filter((assignment) => assignment.status === "ACTIVE")
                  .map((assignment) => (
                    <div
                      className="flex items-center justify-between gap-4 rounded-md border p-3"
                      key={assignment.id}
                    >
                      <div>
                        <Link
                          className="font-medium"
                          href={`/admin/workforce/users/${assignment.user.id}`}
                        >
                          {assignment.user.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {assignment.roleAtBranch}
                        </p>
                      </div>
                      <StatusBadge status={assignment.status} />
                    </div>
                  ))
              )}
            </div>
          </SectionCard>
        </section>
        <SectionCard
          description="Assignment changes are made from the employee profile."
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
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/workforce/users/${assignment.user.id}`}>
                        Open profile
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
        </SectionCard>
    </ErpShell>
  );
}
