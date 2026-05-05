import { ClipboardList, LockKeyhole, Route, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Role, SessionUser } from "@/lib/auth/types";

const roleTitles: Record<Role, string> = {
  PICKER: "Picker Dashboard",
  CHAMP: "Champ Dashboard",
  AREA_MANAGER: "Area Manager Dashboard",
  WORKFORCE_MANAGER: "Workforce Dashboard",
  OPERATIONS_MANAGER: "Operations Dashboard",
  SENIOR_OPERATIONS_MANAGER: "Senior Operations Dashboard",
  ADMIN: "Admin Dashboard",
  SUPER_ADMIN: "Super Admin Dashboard",
};

const foundationItems = [
  {
    title: "Authenticated Session",
    description: "This page is rendered only after a valid server-side session check.",
    icon: LockKeyhole,
  },
  {
    title: "Role Route",
    description: "The user can access only the dashboard route assigned to their role.",
    icon: Route,
  },
  {
    title: "Account Status",
    description: "Blocked statuses and first-login setup rules are enforced before render.",
    icon: UserRound,
  },
  {
    title: "Next Phase Data",
    description: "Organization, approvals, and operational records begin in later phases.",
    icon: ClipboardList,
  },
];

export function RoleDashboard({ role, user }: { role: Role; user: SessionUser }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-normal text-foreground">
          {roleTitles[role]}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          Welcome, {user.name}. Phase 1 confirms authentication, role redirects,
          and protected layout behavior before business modules are added.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {foundationItems.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <item.icon aria-hidden="true" className="text-primary" />
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
