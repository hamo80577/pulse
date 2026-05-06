import Link from "next/link";
import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getBranches } from "@/features/organization/queries";
import { requireRole } from "@/lib/auth/session";

export default async function BranchesPage() {
  const session = await requireRole("ADMIN", "/admin/organization/branches");
  const branches = await getBranches();

  return (
    <ErpShell user={session.user}>
        <PageHeader
          actions={
          <Button asChild>
            <Link href="/admin/organization/branches/new">New branch</Link>
          </Button>
          }
          description="Create branches under active chains."
          title="Branches"
        />
        <SectionCard description="Real branch records in Pulse." title="Branch List">
            {branches.length === 0 ? (
              <EmptyState
                action={
                  <Button asChild>
                    <Link href="/admin/organization/branches/new">Create branch</Link>
                  </Button>
                }
                description="A branch requires an active chain."
                title="No branches yet"
              />
            ) : (
              <div className="grid gap-3">
                {branches.map((branch) => (
                  <Link
                    className="flex items-center justify-between gap-4 rounded-md border p-4 transition-colors hover:bg-muted"
                    href={`/admin/organization/branches/${branch.id}`}
                    key={branch.id}
                  >
                    <div>
                      <p className="font-medium">{branch.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {branch.chain.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {branch.orderSystemBranchId
                          ? `Order ID: ${branch.orderSystemBranchId}`
                          : "No order-system ID"}
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{branch.status}</p>
                      <p>{branch._count.assignments} assignments</p>
                    </div>
                    <StatusBadge status={branch.status} />
                  </Link>
                ))}
              </div>
            )}
        </SectionCard>
    </ErpShell>
  );
}
