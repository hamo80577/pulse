import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PreferencesFoundation } from "@/components/settings/preferences-foundation";
import { requireRole } from "@/lib/auth/session";

export default async function SuperAdminPreferencesPage() {
  const session = await requireRole("SUPER_ADMIN", "/super-admin/settings/preferences");

  return (
    <ErpShell user={session.user}>
      <PageHeader
        description="Language and appearance foundation. Changes are not saved yet."
        title="Preferences"
      />
      <PreferencesFoundation settingsHref="/super-admin/settings" />
    </ErpShell>
  );
}
