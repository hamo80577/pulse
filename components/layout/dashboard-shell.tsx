import type { ReactNode } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/features/auth/actions";
import type { SessionUser } from "@/lib/auth/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DashboardShell({
  children,
  user,
}: {
  children: ReactNode;
  user: SessionUser;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link className="text-lg font-semibold tracking-normal" href="/">
              Pulse
            </Link>
            <Badge variant="secondary">{user.role.replaceAll("_", " ")}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground md:inline">
              {user.name}
            </span>
            <form action={logoutAction}>
              <Button size="sm" type="submit" variant="outline">
                <LogOut data-icon="inline-start" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
