import Link from "next/link";
import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getChains } from "@/features/organization/queries";
import { requireRole } from "@/lib/auth/session";

export default async function ChainsPage() {
  const session = await requireRole("ADMIN", "/admin/organization/chains");
  const chains = await getChains();

  return (
    <ErpShell user={session.user}>
        <PageHeader
          actions={
          <Button asChild>
            <Link href="/admin/organization/chains/new">New chain</Link>
          </Button>
          }
          description="Create and maintain partner chain records."
          title="Chains"
        />
        <SectionCard description="Real chain records in Pulse." title="Chain List">
            {chains.length === 0 ? (
              <EmptyState
                action={
                  <Button asChild>
                    <Link href="/admin/organization/chains/new">Create chain</Link>
                  </Button>
                }
                description="Branches can be added after the first active chain exists."
                title="No chains yet"
              />
            ) : (
              <div className="grid gap-3">
                {chains.map((chain) => (
                  <Link
                    className="flex items-center justify-between gap-4 rounded-md border p-4 transition-colors hover:bg-muted"
                    href={`/admin/organization/chains/${chain.id}`}
                    key={chain.id}
                  >
                    <div>
                      <p className="font-medium">{chain.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Chain ID: {chain.orderSystemChainId}
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{chain.status}</p>
                      <p>{chain._count.branches} branches</p>
                    </div>
                    <StatusBadge status={chain.status} />
                  </Link>
                ))}
              </div>
            )}
        </SectionCard>
    </ErpShell>
  );
}
