import { LogOut } from "lucide-react";
import { logoutAction } from "@/features/auth/actions";
import type { SessionUser } from "@/lib/auth/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BackButton } from "./back-button";

export function Topbar({ user }: { user: SessionUser }) {
  return (
    <header className="sticky top-0 z-20 border-b bg-card/95 backdrop-blur">
      <div className="flex h-14 items-center justify-between gap-4 px-6">
        <div className="flex min-w-0 items-center gap-3">
          <BackButton />
          <p className="text-sm font-medium text-foreground">{user.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{user.role.replaceAll("_", " ")}</Badge>
          <form action={logoutAction}>
            <Button size="sm" type="submit" variant="outline">
              <LogOut data-icon="inline-start" />
              Logout
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
