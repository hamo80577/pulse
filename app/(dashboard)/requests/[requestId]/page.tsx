import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { RequestDetail } from "@/features/approvals/components/request-detail";
import { cancelRequestAction } from "@/features/approvals/actions";
import { getApprovalRequestDetail } from "@/features/approvals/queries";
import { requireSession } from "@/lib/auth/session";

export default async function RequestDetailPage({
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

  const canCancel =
    request.requester.id === session.user.id &&
    !["APPROVED", "REJECTED", "CANCELLED"].includes(request.status);

  return (
    <DashboardShell user={session.user}>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <PageHeader
          actions={
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/requests">Back</Link>
              </Button>
              {canCancel ? (
                <form action={cancelRequestAction}>
                  <input name="requestId" type="hidden" value={request.id} />
                  <Button type="submit" variant="outline">
                    Cancel
                  </Button>
                </form>
              ) : null}
            </div>
          }
          description={request.id}
          title={request.requestType.replaceAll("_", " ")}
        />
        <RequestDetail request={request} user={session.user} />
      </main>
    </DashboardShell>
  );
}
