import Link from "next/link";
import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";
import { ChainForm } from "@/features/organization/components/chain-form";
import { requireRole } from "@/lib/auth/session";

export default async function NewChainPage() {
  const session = await requireRole("ADMIN", "/admin/organization/chains/new");

  return (
    <ErpShell user={session.user}>
        <PageHeader
          actions={
          <Button asChild variant="outline">
          <Link href="/admin/organization/chains">Back to chains</Link>
        </Button>
          }
          description="Create the first level of the organization tree."
          title="New Chain"
        />
        <div className="max-w-3xl">
          <SectionCard description="Use a short operational name." title="Chain Details">
            <ChainForm />
          </SectionCard>
        </div>
    </ErpShell>
  );
}
