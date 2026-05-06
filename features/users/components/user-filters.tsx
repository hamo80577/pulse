import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { roles, userStatuses } from "@/lib/auth/types";

export function UserFilters({
  role,
  status,
  search,
}: {
  role?: string;
  status?: string;
  search?: string;
}) {
  return (
    <form className="grid gap-4 md:grid-cols-[1fr_0.7fr_0.7fr_auto]">
      <div className="grid gap-2">
        <Label htmlFor="search">Search</Label>
        <Input
          defaultValue={search ?? ""}
          id="search"
          name="search"
          placeholder="Name, username, email, phone, shopper ID, IBS ID"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <select
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
          defaultValue={role ?? ""}
          id="role"
          name="role"
        >
          <option value="">All roles</option>
          {roles.map((roleOption) => (
            <option key={roleOption} value={roleOption}>
              {roleOption.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <select
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
          defaultValue={status ?? ""}
          id="status"
          name="status"
        >
          <option value="">All statuses</option>
          {userStatuses.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <Button type="submit" variant="outline">
          Apply
        </Button>
      </div>
    </form>
  );
}
