import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <DashboardShell user={session.user}>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <Button asChild className="w-fit" variant="outline">
          <Link href="/admin/organization/branches">Back to branches</Link>
        </Button>
        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Edit branch</CardTitle>
              <CardDescription>
                {branch.chain.name} / {branch.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BranchForm branch={branch} chains={branchOptions.chains} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Assign user</CardTitle>
              <CardDescription>
                Add an existing active Picker or Champ to this branch.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AssignmentForm
                branches={assignmentOptions.branches}
                defaultBranchId={branch.id}
                users={assignmentOptions.users}
              />
            </CardContent>
          </Card>
        </section>
        <Card>
          <CardHeader>
            <CardTitle>Assignment history</CardTitle>
            <CardDescription>
              End an active assignment to preserve history before replacement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {branch.assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No assignments for this branch.
              </p>
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
          </CardContent>
        </Card>
      </main>
    </DashboardShell>
  );
}
