import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RoleDashboard } from "@/components/dashboards/role-dashboard";
import { requireRole } from "@/lib/auth/session";

export default async function ChampPage() {
  const session = await requireRole("CHAMP", "/champ");

  return (
    <DashboardShell user={session.user}>
      <RoleDashboard role="CHAMP" user={session.user} />
    </DashboardShell>
  );
}
