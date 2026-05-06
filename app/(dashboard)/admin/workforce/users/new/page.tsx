import Link from "next/link";
import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";
import { UserForm } from "@/features/users/components/user-form";
import { requireRole } from "@/lib/auth/session";

export default async function NewWorkforceUserPage() {
  const session = await requireRole("ADMIN", "/admin/workforce/users/new");

  return (
    <ErpShell user={session.user}>
      <PageHeader
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/workforce/users">Back to users</Link>
          </Button>
        }
        description="Create a user and employee profile."
        title="New User"
      />
      <SectionCard description="New users must change password on first login." title="User Details">
        <UserForm />
      </SectionCard>
    </ErpShell>
  );
}
