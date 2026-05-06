import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

const roleDescriptions: Record<Role, string> = {
  PICKER:
    "Your Pulse workspace for profile, requests, and branch visibility. Performance metrics will be added after KPI definitions are finalized.",
  CHAMP:
    "Manage your assigned picker team, requests, and branch operations. Team data begins in the organization phase.",
  AREA_MANAGER:
    "Review scoped branches, champs, and operational requests once organization data is connected.",
  WORKFORCE_MANAGER:
    "Coordinate workforce visibility and staffing workflows as Pulse modules are activated.",
  OPERATIONS_MANAGER:
    "Monitor operational access and request workflows as Pulse modules are activated.",
  SENIOR_OPERATIONS_MANAGER:
    "Review operational governance and reporting access once Pulse reporting modules are connected.",
  ADMIN:
    "Manage users, access, organization setup, and approval operations as modules are activated.",
  SUPER_ADMIN:
    "Full Pulse system control for access, configuration, audit, and operational governance.",
};

export function RoleDashboard({ role, user }: { role: Role; user: SessionUser }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-normal text-foreground">
          {roleTitles[role]}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          Welcome, {user.name}. {roleDescriptions[role]}
        </p>
      </section>
      <section>
        <Card>
          <CardHeader>
            <ShieldCheck aria-hidden="true" className="text-primary" />
            <CardTitle>Access Ready</CardTitle>
            <CardDescription>
              This workspace is protected by Pulse authentication and role-based
              routing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              Operational records will appear only after their owning modules are
              implemented and connected.
            </p>
          </CardContent>
        </Card>
      </section>
      {role === "ADMIN" || role === "SUPER_ADMIN" ? (
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Organization Core</CardTitle>
              <CardDescription>
                Manage Pulse chains, branches, assignments, and manager
                relations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/admin/organization">Open organization</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      ) : null}
    </main>
  );
}
