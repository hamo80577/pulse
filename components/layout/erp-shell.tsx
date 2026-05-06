import type { ReactNode } from "react";
import Link from "next/link";
import { SidebarNav } from "./sidebar-nav";
import { Topbar } from "./topbar";
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

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-card lg:flex lg:flex-col">
        <div className="flex h-14 items-center border-b px-5">
          <Link className="text-lg font-semibold tracking-normal" href="/">
            Pulse
          </Link>
        </div>
        <div className="flex-1 px-3 py-4">
          <SidebarNav items={items} />
        </div>
      </aside>
      <div className="lg:pl-64">
        <Topbar user={user} />
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
