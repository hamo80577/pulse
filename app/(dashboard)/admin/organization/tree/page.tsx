import Link from "next/link";
import { ErpShell } from "@/components/layout/erp-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { OrganizationTree } from "@/features/organization/components/organization-tree";
import { getOrganizationTree } from "@/features/organization/queries";
import { requireRole } from "@/lib/auth/session";

export default async function OrganizationTreePage() {
  const session = await requireRole("ADMIN", "/admin/organization/tree");
  const chains = await getOrganizationTree();

  return (
    <ErpShell user={session.user}>
        <PageHeader
          actions={
          <Button asChild variant="outline">
            <Link href="/admin/organization">Back</Link>
          </Button>
          }
          description="Chain to branch to active Picker and Champ assignments."
          title="Organization Tree"
        />
        <OrganizationTree chains={chains} />
    </ErpShell>
  );
}
