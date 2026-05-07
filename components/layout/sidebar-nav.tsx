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
    <nav aria-label="ERP navigation" className="flex flex-col gap-3">
      {items.map((item) => {
        const Icon = iconMap[item.icon];
        const active =
          item.href === "/admin" || item.href === "/super-admin"
            ? pathname === item.href
            : Boolean(
                item.href &&
                  (pathname === item.href || pathname.startsWith(`${item.href}/`)),
              );

        if (!item.href) {
          return (
            <div
              className="flex h-12 items-center justify-between gap-4 rounded-md px-4 text-base text-on-surface-variant"
              key={item.label}
            >
              <span className="flex min-w-0 items-center gap-4">
                <Icon aria-hidden="true" className="size-6" />
                <span className="truncate">{item.label}</span>
              </span>
            </div>
          );
        }

        return (
          <Link
            className={cn(
              "flex h-12 items-center gap-4 rounded-md px-4 text-base text-on-surface transition-all duration-200 hover:bg-surface-container-low hover:text-secondary-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-action",
              active &&
                "border-r-2 border-secondary-action bg-surface-container-low font-semibold text-secondary-action hover:bg-surface-container-low hover:text-secondary-action",
            )}
            href={item.href}
            key={item.label}
          >
            <Icon aria-hidden="true" className="size-6" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
