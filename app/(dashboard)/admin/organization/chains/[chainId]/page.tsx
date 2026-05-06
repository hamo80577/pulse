import Link from "next/link";
import { notFound } from "next/navigation";
import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ChainForm } from "@/features/organization/components/chain-form";
import { getChainDetail } from "@/features/organization/queries";
import { requireRole } from "@/lib/auth/session";

export default async function ChainDetailPage({
  params,
}: {
  params: Promise<{ chainId: string }>;
}) {
  const { chainId } = await params;
  const session = await requireRole(
    "ADMIN",
    `/admin/organization/chains/${chainId}`,
  );
  const chain = await getChainDetail(chainId);

  if (!chain) {
    notFound();
  }

  return (
    <ErpShell user={session.user}>
        <PageHeader
          actions={
          <Button asChild variant="outline">
          <Link href="/admin/organization/chains">Back to chains</Link>
        </Button>
          }
          description={
            chain.orderSystemChainId
              ? `${chain.code ?? "No code"} / Order ID: ${chain.orderSystemChainId}`
              : chain.code ?? "No code"
          }
          title={chain.name}
        />
        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionCard description="Update chain status or code." title="Chain Details">
              <ChainForm chain={chain} />
          </SectionCard>
          <SectionCard description="Branches assigned to this chain." title="Branches">
              {chain.branches.length === 0 ? (
                <EmptyState
                  action={
                    <Button asChild>
                      <Link href="/admin/organization/branches/new">Create branch</Link>
                    </Button>
                  }
                  title="No branches in this chain"
                />
              ) : (
                <div className="grid gap-3">
                  {chain.branches.map((branch) => (
                    <Link
                      className="flex items-center justify-between gap-4 rounded-md border p-4 transition-colors hover:bg-muted"
                      href={`/admin/organization/branches/${branch.id}`}
                      key={branch.id}
                    >
                      <span className="font-medium">{branch.name}</span>
                      <StatusBadge status={branch.status} />
                    </Link>
                  ))}
                </div>
              )}
          </SectionCard>
        </section>
    </ErpShell>
  );
}
