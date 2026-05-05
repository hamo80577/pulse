import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RoleDashboard } from "@/components/dashboards/role-dashboard";
import { requireRole } from "@/lib/auth/session";

export default async function PickerPage() {
  const session = await requireRole("PICKER", "/picker");

  return (
    <DashboardShell user={session.user}>
      <RoleDashboard role="PICKER" user={session.user} />
    </DashboardShell>
  );
}
