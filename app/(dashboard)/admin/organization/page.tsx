import Link from "next/link";
import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ActionCard } from "@/components/ui/action-card";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
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
    <ErpShell user={session.user}>
      <PageHeader
        actions={
          <Button asChild>
            <Link href="/admin/organization/tree">Review tree</Link>
          </Button>
        }
        description="Build the real organization structure before employee profiles and workflows."
        title="Organization Workbench"
      />

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

        <section className="grid gap-4 md:grid-cols-5">
          <WorkbenchStep done={overview.chainCount > 0} label="1. Chains" />
          <WorkbenchStep done={overview.branchCount > 0} label="2. Branches" />
          <WorkbenchStep
            done={overview.activeAssignmentCount > 0}
            label="3. Assign People"
          />
          <WorkbenchStep
            done={overview.activeRelationCount > 0}
            label="4. Manager Relations"
          />
          <WorkbenchStep done={overview.chainCount > 0} label="5. Review Tree" />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <ActionCard
            action={
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/admin/organization/chains/new">New chain</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/organization/chains">View</Link>
                </Button>
              </div>
            }
            description="Create the partner chain first."
            title="Chains"
          />
          <ActionCard
            action={
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/admin/organization/branches/new">New branch</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/organization/branches">View</Link>
                </Button>
              </div>
            }
            description="Attach branches to active chains."
            title="Branches"
          />
          <ActionCard
            action={
              <Button asChild variant="outline">
                <Link href="/admin/organization/tree">Open tree</Link>
              </Button>
            }
            description="Review active structure."
            title="Review Tree"
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <SectionCard
            description="Existing active Pickers and Champs only."
            title="Assign People"
          >
              <AssignmentForm
                branches={assignmentOptions.branches}
                users={assignmentOptions.users}
              />
          </SectionCard>

          <SectionCard
            description="Supported role pairs only."
            title="Manager Relations"
          >
            <ManagerRelationForm users={managerOptions.users} />
          </SectionCard>
        </section>

        <SectionCard
          description="End a relation before creating a replacement."
          title="Active Manager Relations"
        >
            {activeRelations.length === 0 ? (
              <EmptyState title="No active manager relations" />
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
                    <StatusBadge status={relation.status} />
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
        </SectionCard>
    </ErpShell>
  );
}

function WorkbenchStep({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm">
      <span className="font-medium">{label}</span>
      <StatusBadge status={done ? "Ready" : "Open"} />
    </div>
  );
}
