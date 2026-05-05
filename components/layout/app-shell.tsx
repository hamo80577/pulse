import type { ReactNode } from "react";
import Link from "next/link";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link className="text-lg font-semibold tracking-normal" href="/">
            Pulse
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link className="transition-colors hover:text-foreground" href="/login">
              Sign in
            </Link>
            <Link className="transition-colors hover:text-foreground" href="/docs">
              Docs
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
