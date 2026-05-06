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
import { ChainForm } from "@/features/organization/components/chain-form";
import { requireRole } from "@/lib/auth/session";

export default async function NewChainPage() {
  const session = await requireRole("ADMIN", "/admin/organization/chains/new");

  return (
    <DashboardShell user={session.user}>
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-6 py-10">
        <Button asChild className="w-fit" variant="outline">
          <Link href="/admin/organization/chains">Back to chains</Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>New chain</CardTitle>
            <CardDescription>Create a partner chain record.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChainForm />
          </CardContent>
        </Card>
      </main>
    </DashboardShell>
  );
}
