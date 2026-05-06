import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, LockKeyhole, Network, ShieldCheck } from "lucide-react";
import type { SessionUser } from "@/lib/auth/types";
import { Button } from "@/components/ui/button";
import { ActionCard } from "@/components/ui/action-card";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/ui/metric-card";
import { ModuleCard } from "@/components/ui/module-card";
import { SectionCard } from "@/components/ui/section-card";

type ErpDashboardProps = {
  user: SessionUser;
  overview: {
    chainCount: number;
    branchCount: number;
    activeAssignmentCount: number;
    activeRelationCount: number;
  };
};

export function ErpDashboard({ user, overview }: ErpDashboardProps) {
  const completedSteps = [
    overview.chainCount > 0,
    overview.branchCount > 0,
    overview.activeAssignmentCount > 0,
    overview.activeRelationCount > 0,
  ].filter(Boolean).length;

  return (
    <>
      <section className="grid gap-2">
        <p className="text-sm text-muted-foreground">
          Welcome back, {user.name}
        </p>
        <h1 className="text-2xl font-semibold tracking-normal text-foreground">
          Workforce ERP Dashboard
        </h1>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Chains" value={overview.chainCount} />
        <MetricCard label="Branches" value={overview.branchCount} />
        <MetricCard label="Assignments" value={overview.activeAssignmentCount} />
        <MetricCard label="Manager links" value={overview.activeRelationCount} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          description="Complete the organization baseline before user profile and workflow phases."
          title="Setup Progress"
        >
          <div className="grid gap-3">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${completedSteps * 25}%` }}
              />
            </div>
            <div className="grid gap-2 text-sm">
              <ProgressRow done={overview.chainCount > 0} label="Create chains" />
              <ProgressRow done={overview.branchCount > 0} label="Create branches" />
              <ProgressRow
                done={overview.activeAssignmentCount > 0}
                label="Assign Pickers and Champs"
              />
              <ProgressRow
                done={overview.activeRelationCount > 0}
                label="Create manager relations"
              />
            </div>
          </div>
        </SectionCard>

        <ModuleCard
          action={
            <Button asChild>
              <Link href="/admin/organization">
                Open workbench
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          }
          status="Active"
          title="Organization Core"
        >
          <p className="text-sm leading-6 text-muted-foreground">
            Structure chains, branches, assignments, and manager links.
          </p>
        </ModuleCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ActionCard
          action={
            <Button asChild variant="outline">
              <Link href="/admin/organization/chains/new">New chain</Link>
            </Button>
          }
          description="Start with the partner chain."
          title="Create chain"
        />
        <ActionCard
          action={
            <Button asChild variant="outline">
              <Link href="/admin/organization/branches/new">New branch</Link>
            </Button>
          }
          description="Add branches under active chains."
          title="Create branch"
        />
        <ActionCard
          action={
            <Button asChild variant="outline">
              <Link href="/admin/organization/tree">Review tree</Link>
            </Button>
          }
          description="Check chain, branch, and assignment structure."
          title="Review structure"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Access & Security">
          <div className="grid gap-3 text-sm">
            <SecurityRow icon={<ShieldCheck className="size-4" />} text="Admin-only organization mutations" />
            <SecurityRow icon={<LockKeyhole className="size-4" />} text="Sensitive user fields excluded from organization payloads" />
            <SecurityRow icon={<Network className="size-4" />} text="Assignment history is preserved" />
          </div>
        </SectionCard>
        {overview.chainCount === 0 ? (
          <EmptyState
            action={
              <Button asChild>
                <Link href="/admin/organization/chains/new">Create first chain</Link>
              </Button>
            }
            description="The organization tree starts with an active chain."
            title="Organization setup has not started"
          />
        ) : (
          <SectionCard title="Next Action">
            <p className="text-sm text-muted-foreground">
              Continue organization setup from the workbench.
            </p>
          </SectionCard>
        )}
      </section>
    </>
  );
}

function ProgressRow({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <span>{label}</span>
      <span className={done ? "text-primary" : "text-muted-foreground"}>
        {done ? "Done" : "Open"}
      </span>
    </div>
  );
}

function SecurityRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border px-3 py-2">
      <span className="text-primary">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
