import Link from "next/link";
import { ChevronLeft, ChevronRight, Edit, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { UserListItem } from "../queries";

export function UserList({ users }: { users: UserListItem[] }) {
  if (users.length === 0) {
    return (
      <EmptyState
        action={
          <Button asChild>
            <Link href="/admin/workforce/users/new">Create user</Link>
          </Button>
        }
        description="Create users when onboarding is approved or during controlled admin setup."
        title="No users match these filters"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-[var(--ambient-shadow)]">
      <div className="grid gap-0 md:hidden">
        {users.map((user) => (
          <article
            className="border-b border-outline-variant/60 p-5 last:border-b-0"
            key={user.id}
          >
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-sm font-medium text-secondary-action">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  className="text-lg font-medium text-on-surface transition-colors hover:text-secondary-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-action"
                  href={`/admin/workforce/users/${user.id}`}
                >
                  {user.name}
                </Link>
                <p className="text-base text-on-surface">
                  {user.employeeProfile?.shopperId ?? user.phone}
                </p>
                <p className="mt-3 break-words text-sm text-on-surface-variant">
                  {user.email ?? "No email"}
                </p>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-on-surface-variant">Role</dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center rounded-md border border-outline-variant/60 bg-surface-container-high px-2.5 py-1 font-medium text-on-surface">
                    {formatCompact(user.role)}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-on-surface-variant">Status</dt>
                <dd className="mt-1">
                  <span className={getStatusClassName(user.status)}>
                    <span className="size-1.5 rounded-full bg-current" />
                    {formatCompact(user.status)}
                  </span>
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-on-surface-variant">IBS ID</dt>
                <dd className="mt-1 text-base text-on-surface">
                  {user.employeeProfile?.ibsId ?? "No IBS ID"}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[58rem] border-collapse text-left">
          <thead className="border-b border-outline-variant bg-surface-container-low text-on-surface">
            <tr>
              <th className="px-5 py-5 text-sm font-medium">User</th>
              <th className="px-5 py-5 text-sm font-medium">Email</th>
              <th className="px-5 py-5 text-sm font-medium">Role</th>
              <th className="px-5 py-5 text-sm font-medium">IBS ID</th>
              <th className="px-5 py-5 text-sm font-medium">Status</th>
              <th className="px-5 py-5 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-on-surface">
            {users.map((user) => (
              <tr
                className="group border-b border-outline-variant/60 transition-colors last:border-b-0 even:bg-surface/50 hover:bg-[var(--surface-container-low)]"
                key={user.id}
              >
                <td className="px-5 py-7">
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-sm font-medium text-secondary-action">
                      {getInitials(user.name)}
                    </div>
                    <div className="min-w-0">
                      <Link
                        className="block truncate text-xl font-medium text-on-surface transition-colors hover:text-secondary-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-action"
                        href={`/admin/workforce/users/${user.id}`}
                      >
                        {user.name}
                      </Link>
                      <p className="text-lg text-on-surface">
                        {user.employeeProfile?.shopperId ?? user.phone}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-7 text-lg text-on-surface-variant">
                  {user.email ?? "No email"}
                </td>
                <td className="px-5 py-7">
                  <span className="inline-flex items-center rounded-md border border-outline-variant/60 bg-surface-container-high px-2.5 py-1 text-sm font-medium text-on-surface">
                    {formatCompact(user.role)}
                  </span>
                </td>
                <td className="px-5 py-7 text-lg text-on-surface">
                  {user.employeeProfile?.ibsId ?? "No IBS ID"}
                </td>
                <td className="px-5 py-7">
                  <span className={getStatusClassName(user.status)}>
                    <span className="size-1.5 rounded-full bg-current" />
                    {formatCompact(user.status)}
                  </span>
                </td>
                <td className="px-5 py-7 text-right">
                  <div className="flex justify-end gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                    <Link
                      aria-label={`Edit ${user.name}`}
                      className="inline-flex size-9 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-secondary-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-action"
                      href={`/admin/workforce/users/${user.id}`}
                    >
                      <Edit aria-hidden="true" className="size-5" />
                    </Link>
                    <button
                      aria-label={`More actions for ${user.name}`}
                      className="inline-flex size-9 cursor-pointer items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-secondary-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-action"
                      type="button"
                    >
                      <MoreVertical aria-hidden="true" className="size-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-4 border-t border-outline-variant bg-surface-container-lowest px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-base text-on-surface">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">{users.length}</span> of{" "}
          <span className="font-medium">{users.length}</span> results
        </p>
        <div aria-label="Pagination" className="flex items-center gap-1">
          <button
            aria-label="Previous page"
            className="inline-flex size-10 cursor-not-allowed items-center justify-center rounded border border-outline-variant text-outline opacity-60"
            disabled
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              aria-current={page === 1 ? "page" : undefined}
              className={
                page === 1
                  ? "inline-flex size-10 cursor-pointer items-center justify-center rounded border border-secondary-action bg-surface-container-low text-sm font-medium text-secondary-action"
                  : "inline-flex size-10 cursor-pointer items-center justify-center rounded border border-outline-variant bg-surface-container-lowest text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low"
              }
              key={page}
              type="button"
            >
              {page}
            </button>
          ))}
          <span className="px-1 text-on-surface-variant">...</span>
          <button
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded border border-outline-variant bg-surface-container-lowest text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low"
            type="button"
          >
            6
          </button>
          <button
            aria-label="Next page"
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded border border-outline-variant text-on-surface transition-colors hover:bg-surface-container-low hover:text-secondary-action"
            type="button"
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatCompact(value: string) {
  return value.replaceAll("_", " ");
}

function getStatusClassName(status: string) {
  if (status === "ACTIVE") {
    return "inline-flex items-center gap-1.5 rounded-full border border-secondary-fixed-dim bg-surface-container-low px-3 py-1 text-sm font-medium text-secondary-action";
  }

  return "inline-flex items-center gap-1.5 rounded-full border border-outline-variant bg-surface px-3 py-1 text-sm font-medium text-outline";
}
