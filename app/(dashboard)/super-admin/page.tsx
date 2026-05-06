import { ErpDashboard } from "@/components/dashboards/erp-dashboard";
import { ErpShell } from "@/components/layout/erp-shell";
import { getOrganizationOverview } from "@/features/organization/queries";
import { requireRole } from "@/lib/auth/session";

export default async function SuperAdminPage() {
  const session = await requireRole("SUPER_ADMIN", "/super-admin");
  const overview = await getOrganizationOverview();

  return (
    <ErpShell user={session.user}>
      <ErpDashboard overview={overview} user={session.user} />
    </ErpShell>
  );
}
