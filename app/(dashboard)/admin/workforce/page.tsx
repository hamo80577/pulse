import Link from "next/link";
import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ActionCard } from "@/components/ui/action-card";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionCard } from "@/components/ui/section-card";
import { getWorkforceOverview } from "@/features/users/queries";
import { requireRole } from "@/lib/auth/session";

export default async function WorkforcePage() {
  const session = await requireRole("ADMIN", "/admin/workforce");
  const overview = await getWorkforceOverview();

  return (
    <ErpShell user={session.user}>
      <PageHeader
        actions={
          <Button asChild>
            <Link href="/admin/workforce/users/new">New user</Link>
          </Button>
        }
        description="Manage users, employee profiles, and external IDs."
        title="Workforce"
      />
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Users" value={overview.totalUsers} />
        <MetricCard label="Active" value={overview.activeUsers} />
        <MetricCard label="Profiles" value={overview.profileCount} />
        <MetricCard label="Password resets" value={overview.pendingSetupUsers} />
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        <ActionCard
          action={
            <Button asChild variant="outline">
              <Link href="/admin/workforce/users">View users</Link>
            </Button>
          }
          description="Search and filter safe account records."
          title="Users"
        />
        <ActionCard
          action={
            <Button asChild variant="outline">
              <Link href="/admin/workforce/users/new">Create user</Link>
            </Button>
          }
          description="Create controlled local accounts with employee profiles."
          title="New User"
        />
        <SectionCard title="External ID Readiness">
          <p className="text-sm leading-6 text-muted-foreground">
            Shopper ID and IBS ID are stored as stable employee matching keys.
          </p>
        </SectionCard>
      </section>
    </ErpShell>
  );
}
