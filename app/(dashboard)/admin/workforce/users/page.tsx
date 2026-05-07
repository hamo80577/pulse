import Link from "next/link";
import { ErpShell } from "@/components/layout/erp-shell";
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
      <div className="flex border-b border-outline-variant">
        <Link
          className="flex-1 border-b-2 border-secondary-action px-3 py-3 text-center text-sm font-medium text-secondary-action sm:px-6"
          href="/admin/workforce/users"
        >
          All Users
        </Link>
        <Link
          className="flex-1 border-b-2 border-transparent px-3 py-3 text-center text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low hover:text-secondary-action sm:px-6"
          href="/admin/workforce/users?status=PENDING_SETUP"
        >
          Pending Approval
        </Link>
        <Link
          className="flex-1 border-b-2 border-transparent px-3 py-3 text-center text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low hover:text-secondary-action sm:px-6"
          href="/admin/workforce/users?status=DELETED"
        >
          Archived
        </Link>
      </div>
      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-[var(--ambient-shadow)] lg:p-6">
        <UserFilters role={filters.role} search={filters.search} status={filters.status} />
      </section>
      <UserList users={users} />
    </ErpShell>
  );
}
