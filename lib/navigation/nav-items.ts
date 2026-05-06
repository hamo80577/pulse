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
      icon: "workforce",
      comingSoon: true,
    },
    {
      label: "Organization",
      href: "/admin/organization",
      icon: "organization",
    },
    {
      label: "Requests",
      icon: "requests",
      comingSoon: true,
    },
    {
      label: "Approvals",
      icon: "approvals",
      comingSoon: true,
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
      label: "Settings",
      icon: "settings",
      comingSoon: true,
    },
  ];
}
