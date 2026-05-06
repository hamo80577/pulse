import Link from "next/link";
import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";
import { BranchForm } from "@/features/organization/components/branch-form";
import { getBranchFormOptions } from "@/features/organization/queries";
import { requireRole } from "@/lib/auth/session";

export default async function NewBranchPage() {
  const session = await requireRole("ADMIN", "/admin/organization/branches/new");
  const { chains } = await getBranchFormOptions();

  return (
    <ErpShell user={session.user}>
        <PageHeader
          actions={
          <Button asChild variant="outline">
          <Link href="/admin/organization/branches">Back to branches</Link>
        </Button>
          }
          description="Create a branch under an active chain."
          title="New Branch"
        />
        <div className="max-w-3xl">
          <SectionCard description="Branch belongs to one chain." title="Branch Details">
            <BranchForm chains={chains} />
          </SectionCard>
        </div>
    </ErpShell>
  );
}
