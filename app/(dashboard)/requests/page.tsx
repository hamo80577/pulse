import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";
import { RequestList } from "@/features/approvals/components/request-list";
import { getMyApprovalRequests } from "@/features/approvals/queries";
import { requireSession } from "@/lib/auth/session";

export default async function RequestsPage() {
  const session = await requireSession();
  const requests = await getMyApprovalRequests(session.user.id);

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
          <RequestList requests={requests} />
        </SectionCard>
      </main>
    </DashboardShell>
  );
}
