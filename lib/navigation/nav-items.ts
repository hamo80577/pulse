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
      label: "Workforce",
      href: "/admin/workforce",
      icon: "workforce",
    },
    {
      label: "Organization",
      href: "/admin/organization",
      icon: "organization",
    },
    {
      label: "Requests",
      href: "/requests",
      icon: "requests",
    },
    {
      label: "Approvals",
      href: "/admin/approvals",
      icon: "approvals",
    },
    {
      label: "Notifications",
      icon: "notifications",
      comingSoon: true,
    },
    {
      label: "Audit Logs",
      icon: "audit",
      comingSoon: true,
    },
    {
      label: "Reports",
      icon: "audit",
      comingSoon: true,
    },
    {
      label: "Data Imports",
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
