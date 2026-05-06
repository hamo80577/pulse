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
import { getBranches } from "@/features/organization/queries";
import { requireRole } from "@/lib/auth/session";

export default async function BranchesPage() {
  const session = await requireRole("ADMIN", "/admin/organization/branches");
  const branches = await getBranches();

  return (
    <DashboardShell user={session.user}>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-semibold tracking-normal text-foreground">
              Branches
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Create branches under chains and review staffing history.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/organization/branches/new">New branch</Link>
          </Button>
        </section>
        <Card>
          <CardHeader>
            <CardTitle>Branch list</CardTitle>
            <CardDescription>Real branch records in Pulse.</CardDescription>
          </CardHeader>
          <CardContent>
            {branches.length === 0 ? (
              <p className="text-sm text-muted-foreground">No branches yet.</p>
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
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{branch.status}</p>
                      <p>{branch._count.assignments} assignments</p>
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
