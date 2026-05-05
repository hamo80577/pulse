import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RoleDashboard } from "@/components/dashboards/role-dashboard";
import { requireRole } from "@/lib/auth/session";

export default async function AdminPage() {
  const session = await requireRole("ADMIN", "/admin");

  return (
    <DashboardShell user={session.user}>
      <RoleDashboard role="ADMIN" user={session.user} />
    </DashboardShell>
  );
}
