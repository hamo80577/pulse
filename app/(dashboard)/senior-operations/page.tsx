import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RoleDashboard } from "@/components/dashboards/role-dashboard";
import { requireRole } from "@/lib/auth/session";

export default async function SeniorOperationsPage() {
  const session = await requireRole("SENIOR_OPERATIONS_MANAGER", "/senior-operations");

  return (
    <DashboardShell user={session.user}>
      <RoleDashboard role="SENIOR_OPERATIONS_MANAGER" user={session.user} />
    </DashboardShell>
  );
}
