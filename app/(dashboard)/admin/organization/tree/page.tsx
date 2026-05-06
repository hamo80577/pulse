import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { OrganizationTree } from "@/features/organization/components/organization-tree";
import { getOrganizationTree } from "@/features/organization/queries";
import { requireRole } from "@/lib/auth/session";

export default async function OrganizationTreePage() {
  const session = await requireRole("ADMIN", "/admin/organization/tree");
  const chains = await getOrganizationTree();

  return (
    <DashboardShell user={session.user}>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-semibold tracking-normal text-foreground">
              Organization Tree
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Chain to branch to active Picker and Champ assignments.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/organization">Back</Link>
          </Button>
        </section>
        <OrganizationTree chains={chains} />
      </main>
    </DashboardShell>
  );
}
