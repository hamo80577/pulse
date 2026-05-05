import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RoleDashboard } from "@/components/dashboards/role-dashboard";
import { requireRole } from "@/lib/auth/session";

export default async function AreaManagerPage() {
  const session = await requireRole("AREA_MANAGER", "/area-manager");

  return (
    <DashboardShell user={session.user}>
      <RoleDashboard role="AREA_MANAGER" user={session.user} />
    </DashboardShell>
  );
}
