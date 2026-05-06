import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { RequestList } from "@/features/approvals/components/request-list";
import { getAdminApprovalQueue } from "@/features/approvals/queries";
import { requireRole } from "@/lib/auth/session";

export default async function AdminApprovalsPage() {
  const session = await requireRole("ADMIN", "/admin/approvals");
  const requests = await getAdminApprovalQueue();

  return (
    <ErpShell user={session.user}>
      <PageHeader
        description="Operational view of approval requests across Pulse."
        title="Approvals"
      />
      <SectionCard title="Approval Requests">
        <RequestList detailBasePath="/approvals" requests={requests} />
      </SectionCard>
    </ErpShell>
  );
}
