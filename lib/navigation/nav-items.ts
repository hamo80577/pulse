import type { Role } from "@/lib/auth/types";

export type NavItem = {
  label: string;
  href?: string;
  icon:
    | "audit"
    | "approvals"
    | "dashboard"
    | "notifications"
    | "organization"
    | "requests"
    | "settings"
    | "workforce";
  comingSoon?: boolean;
};

export function getAdminNavItems(role: Role): NavItem[] {
  const dashboardHref = role === "SUPER_ADMIN" ? "/super-admin" : "/admin";

  return [
    {
      label: "Dashboard",
      href: dashboardHref,
      icon: "dashboard",
    },
    {
      label: "Users",
      href: "/admin/workforce/users",
      icon: "workforce",
    },
    {
      label: "Roles",
      href: "/admin/organization",
      icon: "organization",
    },
    {
      label: "Reports",
      icon: "audit",
      comingSoon: true,
    },
    {
      label: "Settings",
      href: role === "SUPER_ADMIN" ? "/super-admin/settings" : "/admin/settings",
      icon: "settings",
    },
  ];
}
