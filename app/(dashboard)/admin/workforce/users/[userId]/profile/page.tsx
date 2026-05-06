import Link from "next/link";
import { notFound } from "next/navigation";
import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";
import { UserForm } from "@/features/users/components/user-form";
import { getUserDetail } from "@/features/users/queries";
import { requireRole } from "@/lib/auth/session";

export default async function WorkforceUserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const session = await requireRole(
    "ADMIN",
    `/admin/workforce/users/${userId}/profile`,
  );
  const user = await getUserDetail(userId);

  if (!user) {
    notFound();
  }

  return (
    <ErpShell user={session.user}>
      <PageHeader
        actions={
          <Button asChild variant="outline">
            <Link href={`/admin/workforce/users/${user.id}`}>Back to user</Link>
          </Button>
        }
        description="Edit account and employee profile fields."
        title="Edit User"
      />
      <SectionCard title="Profile">
        <UserForm user={user} />
      </SectionCard>
    </ErpShell>
  );
}
