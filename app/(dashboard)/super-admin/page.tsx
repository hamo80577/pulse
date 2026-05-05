import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RoleDashboard } from "@/components/dashboards/role-dashboard";
import { requireRole } from "@/lib/auth/session";

export default async function SuperAdminPage() {
  const session = await requireRole("SUPER_ADMIN", "/super-admin");

  return (
    <DashboardShell user={session.user}>
      <RoleDashboard role="SUPER_ADMIN" user={session.user} />
    </DashboardShell>
  );
}
