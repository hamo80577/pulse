import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";
import { PaginationControls } from "@/features/approvals/components/pagination-controls";
import { RequestList } from "@/features/approvals/components/request-list";
import { getMyApprovalRequests } from "@/features/approvals/queries";
import { requireSession } from "@/lib/auth/session";

type RequestsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getPage(searchParams: Record<string, string | string[] | undefined>) {
  const page = searchParams.page;
  return Array.isArray(page) ? page[0] : page;
}

export default async function RequestsPage({ searchParams }: RequestsPageProps) {
  const session = await requireSession();
  const params = searchParams ? await searchParams : {};
  const result = await getMyApprovalRequests(session.user.id, {
    page: getPage(params),
  });

  return (
    <DashboardShell user={session.user}>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <PageHeader
          actions={
            <Button asChild>
              <Link href="/requests/new">New request</Link>
            </Button>
          }
          description="Track requests you submitted through the generic approval engine."
          title="My Requests"
        />
        <SectionCard title="Submitted Requests">
          <RequestList requests={result.requests} />
        </SectionCard>
        <PaginationControls
          basePath="/requests"
          hasNextPage={result.hasNextPage}
          page={result.page}
        />
      </main>
    </DashboardShell>
  );
}
