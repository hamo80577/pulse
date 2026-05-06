import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <DashboardShell user={session.user}>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <Button asChild className="w-fit" variant="outline">
          <Link href="/admin/organization/chains">Back to chains</Link>
        </Button>
        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Edit chain</CardTitle>
              <CardDescription>{chain.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChainForm chain={chain} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Branches</CardTitle>
              <CardDescription>Branches assigned to this chain.</CardDescription>
            </CardHeader>
            <CardContent>
              {chain.branches.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No branches in this chain.
                </p>
              ) : (
                <div className="grid gap-3">
                  {chain.branches.map((branch) => (
                    <Link
                      className="flex items-center justify-between gap-4 rounded-md border p-4 transition-colors hover:bg-muted"
                      href={`/admin/organization/branches/${branch.id}`}
                      key={branch.id}
                    >
                      <span className="font-medium">{branch.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {branch.status}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </DashboardShell>
  );
}
