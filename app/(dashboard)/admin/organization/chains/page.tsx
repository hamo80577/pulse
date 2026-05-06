import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getChains } from "@/features/organization/queries";
import { requireRole } from "@/lib/auth/session";

export default async function ChainsPage() {
  const session = await requireRole("ADMIN", "/admin/organization/chains");
  const chains = await getChains();

  return (
    <DashboardShell user={session.user}>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-semibold tracking-normal text-foreground">
              Chains
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Create and maintain partner chain records.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/organization/chains/new">New chain</Link>
          </Button>
        </section>
        <Card>
          <CardHeader>
            <CardTitle>Chain list</CardTitle>
            <CardDescription>Real chain records in Pulse.</CardDescription>
          </CardHeader>
          <CardContent>
            {chains.length === 0 ? (
              <p className="text-sm text-muted-foreground">No chains yet.</p>
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
                        {chain.code ?? "No code"}
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{chain.status}</p>
                      <p>{chain._count.branches} branches</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </DashboardShell>
  );
}
