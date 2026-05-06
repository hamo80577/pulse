import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { RequestDetail } from "@/features/approvals/components/request-detail";
import { getApprovalRequestDetail } from "@/features/approvals/queries";
import { requireSession } from "@/lib/auth/session";

export default async function ApprovalDetailPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const session = await requireSession();
  const request = await getApprovalRequestDetail(requestId, session.user);

  if (!request) {
    notFound();
  }

  return (
    <DashboardShell user={session.user}>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <PageHeader
          actions={
            <Button asChild variant="outline">
              <Link href="/approvals">Back</Link>
            </Button>
          }
          description={request.id}
          title="Approval Detail"
        />
        <RequestDetail request={request} showDecisionPanel user={session.user} />
      </main>
    </DashboardShell>
  );
}
