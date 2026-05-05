import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RoleDashboard } from "@/components/dashboards/role-dashboard";
import { requireRole } from "@/lib/auth/session";

export default async function OperationsPage() {
  const session = await requireRole("OPERATIONS_MANAGER", "/operations");

  return (
    <DashboardShell user={session.user}>
      <RoleDashboard role="OPERATIONS_MANAGER" user={session.user} />
    </DashboardShell>
  );
}
