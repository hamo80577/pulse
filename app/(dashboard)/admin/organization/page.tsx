import Link from "next/link";
import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ActionCard } from "@/components/ui/action-card";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getOrganizationOverview } from "@/features/organization/queries";
import { requireRole } from "@/lib/auth/session";

export default async function OrganizationPage() {
  const session = await requireRole("ADMIN", "/admin/organization");
  const overview = await getOrganizationOverview();

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
            label="3. Workforce Assignments"
          />
          <WorkbenchStep
            done={overview.activeRelationCount > 0}
            label="4. Reporting Structure"
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
          <ActionCard
            action={
              <Button asChild>
                <Link href="/admin/workforce">Open Workforce</Link>
              </Button>
            }
            description="Assignments are managed from employee profiles."
            title="Employee Assignments"
          />
          <ActionCard
            action={
              <Button asChild variant="outline">
                <Link href="/admin/organization/tree">Review Organization Tree</Link>
              </Button>
            }
            description="Use the tree to review chains, branches, assignments, and reporting structure."
            title="Structure Review"
          />
        </section>
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
