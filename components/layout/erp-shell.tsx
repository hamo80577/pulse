import type { ReactNode } from "react";
import Link from "next/link";
import { Bell, CircleHelp, LogOut, Search } from "lucide-react";
import { logoutAction } from "@/features/auth/actions";
import { SidebarNav } from "./sidebar-nav";
import type { SessionUser } from "@/lib/auth/types";
import { getAdminNavItems } from "@/lib/navigation/nav-items";

export function ErpShell({
  children,
  user,
}: {
  children: ReactNode;
  user: SessionUser;
}) {
  const items = getAdminNavItems(user.role);
  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 z-40 h-20 w-full border-b border-outline-variant bg-surface/85 shadow-sm backdrop-blur-md">
        <div className="flex h-full items-center justify-end gap-5 px-5 sm:px-8 lg:px-10">
          <label className="relative hidden md:block">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-outline"
            />
            <input
              aria-label="Global search"
              className="h-11 w-72 rounded-md border border-outline-variant bg-surface-container-lowest pl-10 pr-3 text-base text-on-surface shadow-sm outline-none transition-all placeholder:text-on-surface-variant focus:border-secondary-action focus:ring-2 focus:ring-secondary-action/20 lg:w-80"
              placeholder="Search..."
              type="search"
            />
          </label>
          <button
            aria-label="Notifications"
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container-low hover:text-secondary-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-action"
            type="button"
          >
            <Bell aria-hidden="true" className="size-5" />
          </button>
          <div aria-hidden="true" className="h-11 w-px bg-outline-variant" />
          <div
            aria-label={`${user.name} profile`}
            className="flex size-11 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-high text-sm font-semibold text-secondary-action shadow-sm"
            role="img"
          >
            {initials || "PU"}
          </div>
        </div>
      </header>

      <aside className="hidden border-r border-outline-variant bg-surface-container-lowest shadow-sm lg:fixed lg:left-0 lg:top-20 lg:flex lg:h-[calc(100dvh-5rem)] lg:w-80 lg:flex-col">
        <div className="flex-1 px-5 py-8">
          <SidebarNav items={items} />
        </div>
        <div className="mx-5 border-t border-outline-variant py-6">
          <Link
            className="flex h-12 items-center gap-4 rounded-md px-4 text-base text-on-surface transition-colors hover:bg-surface-container-low hover:text-secondary-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-action"
            href="/docs"
          >
            <CircleHelp aria-hidden="true" className="size-6" />
            <span>Help</span>
          </Link>
          <form action={logoutAction}>
            <button
              className="mt-2 flex h-12 w-full cursor-pointer items-center gap-4 rounded-md px-4 text-left text-base text-on-surface transition-colors hover:bg-surface-container-low hover:text-secondary-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-action"
              type="submit"
            >
              <LogOut aria-hidden="true" className="size-6" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      <div className="pt-20 lg:pl-80">
        <main className="flex min-h-[calc(100dvh-5rem)] w-full flex-col gap-8 bg-background px-5 py-8 sm:px-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
