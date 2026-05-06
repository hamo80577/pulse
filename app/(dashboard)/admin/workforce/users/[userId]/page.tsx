import Link from "next/link";
import { notFound } from "next/navigation";
import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { AssignmentSummary } from "@/features/users/components/assignment-summary";
import { UserDetailSections } from "@/features/users/components/user-detail";
import {
  getUserAssignmentFormOptions,
  getUserAssignmentSummary,
  getUserDetail,
} from "@/features/users/queries";
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

  const [summary, formOptions] = await Promise.all([
    getUserAssignmentSummary(user.id),
    getUserAssignmentFormOptions(user),
  ]);

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
      <nav className="flex flex-wrap gap-2">
        {["Overview", "Profile", "Assignments", "Manager Relations", "Security"].map(
          (section) => (
            <Button asChild key={section} size="sm" variant="outline">
              <a href={`#${section.toLowerCase().replaceAll(" ", "-")}`}>
                {section}
              </a>
            </Button>
          ),
        )}
      </nav>
      <UserDetailSections user={user} />
      <AssignmentSummary
        formOptions={formOptions}
        summary={summary}
        user={user}
      />
    </ErpShell>
  );
}
