import Link from "next/link";
import { notFound } from "next/navigation";
import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { AssignmentSummary } from "@/features/users/components/assignment-summary";
import {
  getUserAssignmentFormOptions,
  getUserAssignmentSummary,
  getUserDetail,
} from "@/features/users/queries";
import { requireRole } from "@/lib/auth/session";

export default async function WorkforceUserAssignmentsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const session = await requireRole(
    "ADMIN",
    `/admin/workforce/users/${userId}/assignments`,
  );
  const [user, summary] = await Promise.all([
    getUserDetail(userId),
    getUserAssignmentSummary(userId),
  ]);

  if (!user) {
    notFound();
  }

  const formOptions = await getUserAssignmentFormOptions(user);

  return (
    <ErpShell user={session.user}>
      <PageHeader
        actions={
          <Button asChild variant="outline">
            <Link href={`/admin/workforce/users/${user.id}`}>Back to user</Link>
          </Button>
        }
        description="Branch assignments and manager relations."
        title={`${user.name} Assignments`}
      />
      <AssignmentSummary formOptions={formOptions} summary={summary} user={user} />
    </ErpShell>
  );
}
