import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
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
    <div className="grid gap-3">
      {users.map((user) => (
        <Link
          className="grid gap-3 rounded-md border p-4 transition-colors hover:bg-muted lg:grid-cols-[1fr_0.8fr_0.7fr_auto]"
          href={`/admin/workforce/users/${user.id}`}
          key={user.id}
        >
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.phone}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>{user.email ?? "No email"}</p>
            <p>{user.employeeProfile?.employmentStatus ?? "No employment status"}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>{user.employeeProfile?.shopperId ?? "No shopper ID"}</p>
            <p>{user.employeeProfile?.ibsId ?? "No IBS ID"}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={user.role} />
            <StatusBadge status={user.status} />
          </div>
        </Link>
      ))}
    </div>
  );
}
