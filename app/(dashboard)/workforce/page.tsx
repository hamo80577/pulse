import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RoleDashboard } from "@/components/dashboards/role-dashboard";
import { requireRole } from "@/lib/auth/session";

export default async function WorkforcePage() {
  const session = await requireRole("WORKFORCE_MANAGER", "/workforce");

  return (
    <DashboardShell user={session.user}>
      <RoleDashboard role="WORKFORCE_MANAGER" user={session.user} />
    </DashboardShell>
  );
}
