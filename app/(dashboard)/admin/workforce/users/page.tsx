import Link from "next/link";
import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";
import { UserFilters } from "@/features/users/components/user-filters";
import { UserList } from "@/features/users/components/user-list";
import { getUsers } from "@/features/users/queries";
import { requireRole } from "@/lib/auth/session";

export default async function WorkforceUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; status?: string; search?: string }>;
}) {
  const session = await requireRole("ADMIN", "/admin/workforce/users");
  const filters = await searchParams;
  const users = await getUsers(filters);

  return (
    <ErpShell user={session.user}>
      <PageHeader
        actions={
          <Button asChild>
            <Link href="/admin/workforce/users/new">New user</Link>
          </Button>
        }
        description="Safe user list with profile external IDs."
        title="Users"
      />
      <SectionCard title="Filters">
        <UserFilters role={filters.role} search={filters.search} status={filters.status} />
      </SectionCard>
      <SectionCard description={`${users.length} users found.`} title="User List">
        <UserList users={users} />
      </SectionCard>
    </ErpShell>
  );
}
