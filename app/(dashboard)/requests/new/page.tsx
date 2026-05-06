import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { RequestForm } from "@/features/approvals/components/request-form";
import { requireSession } from "@/lib/auth/session";

export default async function NewRequestPage() {
  const session = await requireSession();

  return (
    <DashboardShell user={session.user}>
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-8">
        <PageHeader
          description="Phase 4 proves the generic engine with an annual leave request payload. Later phases add business-specific forms and side effects."
          title="New Request"
        />
        <SectionCard title="Annual Leave Proof Request">
          <RequestForm />
        </SectionCard>
      </main>
    </DashboardShell>
  );
}
