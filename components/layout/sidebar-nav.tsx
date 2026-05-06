"use client";

import Link from "next/link";
import {
  Bell,
  ClipboardCheck,
  FileClock,
  LayoutDashboard,
  Network,
  Settings,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/navigation/nav-items";
import { cn } from "@/lib/utils";

const iconMap = {
  audit: ShieldCheck,
  approvals: ClipboardCheck,
  dashboard: LayoutDashboard,
  notifications: Bell,
  organization: Network,
  requests: FileClock,
  settings: Settings,
  workforce: UsersRound,
} satisfies Record<NavItem["icon"], typeof LayoutDashboard>;

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="ERP navigation" className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = iconMap[item.icon];
        const active =
          item.href === "/admin/organization"
            ? pathname.startsWith("/admin/organization")
            : pathname === item.href;

        if (!item.href) {
          return (
            <div
              className="flex h-10 items-center justify-between gap-3 rounded-md px-3 text-sm text-muted-foreground"
              key={item.label}
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon aria-hidden="true" className="size-4" />
                <span className="truncate">{item.label}</span>
              </span>
              <span className="rounded-sm border px-1.5 py-0.5 text-[10px] uppercase tracking-normal">
                Soon
              </span>
            </div>
          );
        }

        return (
          <Link
            className={cn(
              "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            )}
            href={item.href}
            key={item.label}
          >
            <Icon aria-hidden="true" className="size-4" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
