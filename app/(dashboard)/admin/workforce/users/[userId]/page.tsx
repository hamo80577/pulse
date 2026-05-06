import Link from "next/link";
import { notFound } from "next/navigation";
import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { UserDetailSections } from "@/features/users/components/user-detail";
import { getUserDetail } from "@/features/users/queries";
import { requireRole } from "@/lib/auth/session";

export default async function WorkforceUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const session = await requireRole("ADMIN", `/admin/workforce/users/${userId}`);
  const user = await getUserDetail(userId);

  if (!user) {
    notFound();
  }

  return (
    <ErpShell user={session.user}>
      <PageHeader
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/workforce/users">Back</Link>
            </Button>
            <Button asChild>
              <Link href={`/admin/workforce/users/${user.id}/profile`}>Edit profile</Link>
            </Button>
          </div>
        }
        description={user.username}
        title={user.name}
      />
      <UserDetailSections user={user} />
    </ErpShell>
  );
}
