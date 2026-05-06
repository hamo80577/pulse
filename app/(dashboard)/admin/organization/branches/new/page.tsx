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
import { BranchForm } from "@/features/organization/components/branch-form";
import { getBranchFormOptions } from "@/features/organization/queries";
import { requireRole } from "@/lib/auth/session";

export default async function NewBranchPage() {
  const session = await requireRole("ADMIN", "/admin/organization/branches/new");
  const { chains } = await getBranchFormOptions();

  return (
    <DashboardShell user={session.user}>
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-6 py-10">
        <Button asChild className="w-fit" variant="outline">
          <Link href="/admin/organization/branches">Back to branches</Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>New branch</CardTitle>
            <CardDescription>Create a branch under an active chain.</CardDescription>
          </CardHeader>
          <CardContent>
            <BranchForm chains={chains} />
          </CardContent>
        </Card>
      </main>
    </DashboardShell>
  );
}
