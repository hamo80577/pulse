import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AssignmentForm } from "@/features/organization/components/assignment-form";
import { ManagerRelationForm } from "@/features/organization/components/manager-relation-form";
import { endManagerRelationAction } from "@/features/organization/actions";
import {
  getActiveManagerRelations,
  getAssignmentFormOptions,
  getManagerRelationFormOptions,
  getOrganizationOverview,
} from "@/features/organization/queries";
import { requireRole } from "@/lib/auth/session";

export default async function OrganizationPage() {
  const session = await requireRole("ADMIN", "/admin/organization");
  const [overview, assignmentOptions, managerOptions, activeRelations] =
    await Promise.all([
      getOrganizationOverview(),
      getAssignmentFormOptions(),
      getManagerRelationFormOptions(),
      getActiveManagerRelations(),
    ]);

  return (
    <DashboardShell user={session.user}>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-normal text-foreground">
            Organization
          </h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Manage Pulse chains, branches, branch assignment history, and manager
            relations. User creation and employee profiles begin in the user
            management phase.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Chains" value={overview.chainCount} />
          <MetricCard label="Branches" value={overview.branchCount} />
          <MetricCard
            label="Active assignments"
            value={overview.activeAssignmentCount}
          />
          <MetricCard
            label="Manager relations"
            value={overview.activeRelationCount}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Chains</CardTitle>
              <CardDescription>Create and update partner chains.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button asChild>
                <Link href="/admin/organization/chains/new">New chain</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/organization/chains">View chains</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Branches</CardTitle>
              <CardDescription>Create branches under active chains.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button asChild>
                <Link href="/admin/organization/branches/new">New branch</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/organization/branches">View branches</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tree</CardTitle>
              <CardDescription>Review chain, branch, and user placement.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/admin/organization/tree">Open tree</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Assign user to branch</CardTitle>
              <CardDescription>
                Assign existing active Pickers or Champs. New users are created
                in the user management phase.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AssignmentForm
                branches={assignmentOptions.branches}
                users={assignmentOptions.users}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manager relation</CardTitle>
              <CardDescription>
                Link existing active users with supported manager relationships.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ManagerRelationForm users={managerOptions.users} />
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Active manager relations</CardTitle>
            <CardDescription>
              End a relation to preserve history before creating a replacement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeRelations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No active manager relations.
              </p>
            ) : (
              <div className="grid gap-3">
                {activeRelations.map((relation) => (
                  <div
                    className="flex items-center justify-between gap-4 rounded-md border p-4"
                    key={relation.id}
                  >
                    <div>
                      <p className="font-medium">
                        {relation.manager.name} to {relation.employee.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {relation.relationType.replaceAll("_", " ")}
                      </p>
                    </div>
                    <form action={endManagerRelationAction}>
                      <input name="relationId" type="hidden" value={relation.id} />
                      <Button size="sm" type="submit" variant="outline">
                        End relation
                      </Button>
                    </form>
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

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle>{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
