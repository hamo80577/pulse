import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { ApprovalQueue } from "@/features/approvals/components/approval-queue";
import { PaginationControls } from "@/features/approvals/components/pagination-controls";
import { getApprovalQueue } from "@/features/approvals/queries";
import { requireSession } from "@/lib/auth/session";

type ApprovalsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getPage(searchParams: Record<string, string | string[] | undefined>) {
  const page = searchParams.page;
  return Array.isArray(page) ? page[0] : page;
}

export default async function ApprovalsPage({ searchParams }: ApprovalsPageProps) {
  const session = await requireSession();
  const params = searchParams ? await searchParams : {};
  const result = await getApprovalQueue(session.user, {
    page: getPage(params),
  });

  return (
    <DashboardShell user={session.user}>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <PageHeader
          description="Active approval steps assigned to your role or user."
          title="Approvals"
        />
        <SectionCard title="Approval Queue">
          <ApprovalQueue requests={result.requests} />
        </SectionCard>
        <PaginationControls
          basePath="/approvals"
          hasNextPage={result.hasNextPage}
          page={result.page}
        />
      </main>
    </DashboardShell>
  );
}
