import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { PaginationControls } from "@/features/approvals/components/pagination-controls";
import { RequestList } from "@/features/approvals/components/request-list";
import { getAdminApprovalQueue } from "@/features/approvals/queries";
import { requireRole } from "@/lib/auth/session";

type AdminApprovalsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getPage(searchParams: Record<string, string | string[] | undefined>) {
  const page = searchParams.page;
  return Array.isArray(page) ? page[0] : page;
}

export default async function AdminApprovalsPage({
  searchParams,
}: AdminApprovalsPageProps) {
  const session = await requireRole("ADMIN", "/admin/approvals");
  const params = searchParams ? await searchParams : {};
  const result = await getAdminApprovalQueue({
    page: getPage(params),
  });

  return (
    <ErpShell user={session.user}>
      <PageHeader
        description="Operational view of approval requests across Pulse."
        title="Approvals"
      />
      <SectionCard title="Approval Requests">
        <RequestList detailBasePath="/approvals" requests={result.requests} />
      </SectionCard>
      <PaginationControls
        basePath="/admin/approvals"
        hasNextPage={result.hasNextPage}
        page={result.page}
      />
    </ErpShell>
  );
}
