import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <form className="grid items-end gap-5 lg:grid-cols-[minmax(18rem,1fr)_15rem_15rem_auto]">
      <div className="grid gap-2">
        <Label className="text-sm font-medium text-on-surface" htmlFor="search">
          Search
        </Label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-outline"
          />
          <input
            className="h-12 w-full rounded-md border border-outline-variant bg-surface pl-10 pr-3 text-base text-on-surface outline-none transition-all placeholder:text-on-surface-variant focus:border-secondary-action focus:ring-2 focus:ring-secondary-action/20"
            defaultValue={search ?? ""}
            id="search"
            name="search"
            placeholder="Name, email, phone, shopper ID..."
            type="search"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label className="text-sm font-medium text-on-surface" htmlFor="role">
          Role
        </Label>
        <select
          className="h-12 w-full cursor-pointer rounded-md border border-outline-variant bg-surface px-3 text-base text-on-surface outline-none transition-all focus:border-secondary-action focus:ring-2 focus:ring-secondary-action/20"
          defaultValue={role ?? ""}
          id="role"
          name="role"
        >
          <option value="">All Roles</option>
          {roles.map((roleOption) => (
            <option key={roleOption} value={roleOption}>
              {formatOption(roleOption)}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <Label className="text-sm font-medium text-on-surface" htmlFor="status">
          Status
        </Label>
        <select
          className="h-12 w-full cursor-pointer rounded-md border border-outline-variant bg-surface px-3 text-base text-on-surface outline-none transition-all focus:border-secondary-action focus:ring-2 focus:ring-secondary-action/20"
          defaultValue={status ?? ""}
          id="status"
          name="status"
        >
          <option value="">All Statuses</option>
          {userStatuses.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {formatOption(statusOption)}
            </option>
          ))}
        </select>
      </div>
      <Button
        className="h-12 border-secondary-fixed-dim bg-surface-container-low px-6 text-base font-medium text-secondary-action hover:bg-surface-container-high hover:text-secondary-action"
        type="submit"
        variant="outline"
      >
        Apply Filters
      </Button>
    </form>
  );
}

function formatOption(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
