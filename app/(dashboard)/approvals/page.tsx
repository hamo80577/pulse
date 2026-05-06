import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { ApprovalQueue } from "@/features/approvals/components/approval-queue";
import { getApprovalQueue } from "@/features/approvals/queries";
import { requireSession } from "@/lib/auth/session";

export default async function ApprovalsPage() {
  const session = await requireSession();
  const requests = await getApprovalQueue(session.user);

  return (
    <DashboardShell user={session.user}>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <PageHeader
          description="Active approval steps assigned to your role or user."
          title="Approvals"
        />
        <SectionCard title="Approval Queue">
          <ApprovalQueue requests={requests} />
        </SectionCard>
      </main>
    </DashboardShell>
  );
}
