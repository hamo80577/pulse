import Link from "next/link";
import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";
import { requireRole } from "@/lib/auth/session";

export default async function AdminSettingsPage() {
  const session = await requireRole("ADMIN", "/admin/settings");

  return (
    <ErpShell user={session.user}>
      <PageHeader
        description="Foundation settings for language and appearance."
        title="Settings"
      />
      <SectionCard
        action={
          <Button asChild>
            <Link href="/admin/settings/preferences">Open preferences</Link>
          </Button>
        }
        description="Language and appearance controls are prepared but not persisted yet."
        title="Preferences"
      >
        <p className="text-sm leading-6 text-muted-foreground">
          Coming soon: save English or Arabic and Light, Dark, or System per user.
        </p>
      </SectionCard>
    </ErpShell>
  );
}
