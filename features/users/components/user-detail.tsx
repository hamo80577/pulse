import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { UserDetail } from "../queries";
import { forcePasswordResetAction } from "../actions";

export function UserDetailSections({ user }: { user: UserDetail }) {
  const profile = user.employeeProfile;

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-2" id="overview">
        <SectionCard description={user.username} title="Overview">
          <dl className="grid gap-3 text-sm">
            <Row label="Name" value={user.name} />
            <Row label="Email" value={user.email ?? "Not set"} />
            <Row label="Phone" value={user.phone ?? "Not set"} />
          </dl>
        </SectionCard>
        <SectionCard title="Security" description="Account state and password controls.">
          <div className="grid gap-4" id="security">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={user.role} />
              <StatusBadge status={user.status} />
              <StatusBadge
                status={user.mustChangePassword ? "Password reset required" : "Password current"}
              />
            </div>
            <form action={forcePasswordResetAction}>
              <input name="userId" type="hidden" value={user.id} />
              <Button size="sm" type="submit" variant="outline">
                Force password reset
              </Button>
            </form>
          </div>
        </SectionCard>
      </div>
      <div className="grid gap-4 lg:grid-cols-2" id="profile">
        <SectionCard
          action={
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/workforce/users/${user.id}/profile`}>Edit</Link>
            </Button>
          }
          title="Profile"
        >
          <dl className="grid gap-3 text-sm">
            <Row label="Employment status" value={profile?.employmentStatus ?? "Not set"} />
            <Row
              label="Hire date"
              value={profile?.hireDate?.toISOString().slice(0, 10) ?? "Not set"}
            />
            <Row label="Address" value={profile?.address ?? "Not set"} />
          </dl>
        </SectionCard>
        <SectionCard title="External IDs">
          <dl className="grid gap-3 text-sm">
            <Row label="National ID" value={profile?.nationalId ?? "Not set"} />
            <Row label="Shopper ID" value={profile?.shopperId ?? "Not set"} />
            <Row label="IBS ID" value={profile?.ibsId ?? "Not set"} />
          </dl>
        </SectionCard>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border px-3 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
