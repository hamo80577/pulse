import { ArrowRight, Bell, ClipboardCheck, Network, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const foundationItems = [
  {
    title: "Role Portals",
    description: "Dedicated routes for Pickers, Champs, managers, Admin, and Super Admin.",
    icon: ShieldCheck,
  },
  {
    title: "Organization Core",
    description: "Chain, branch, assignment, and manager history will be built in phases.",
    icon: Network,
  },
  {
    title: "Approval Workflows",
    description: "A generic approval engine will control operational lifecycle requests.",
    icon: ClipboardCheck,
  },
  {
    title: "Notifications",
    description: "Decision queues and status updates will be delivered through a center.",
    icon: Bell,
  },
];

export default function Home() {
  return (
    <AppShell>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-8">
        <section className="grid gap-8 py-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-foreground md:text-6xl">
                Plus operations foundation
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                A clean bootstrap for the workforce platform. Phase 0 sets up the
                application shell, tooling, Prisma, and documentation without
                pretending later business workflows are complete.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/docs">
                  View roadmap
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a href="https://nextjs.org/docs" rel="noreferrer" target="_blank">
                  Next.js docs
                </a>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Phase 0 status</CardTitle>
              <CardDescription>
                Infrastructure only. Authentication and protected dashboards start
                in Phase 1.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 text-sm">
                <div className="flex items-center justify-between gap-4 rounded-md border px-4 py-3">
                  <dt className="text-muted-foreground">Framework</dt>
                  <dd className="font-medium">Next.js App Router</dd>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-md border px-4 py-3">
                  <dt className="text-muted-foreground">Language</dt>
                  <dd className="font-medium">TypeScript</dd>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-md border px-4 py-3">
                  <dt className="text-muted-foreground">Database</dt>
                  <dd className="font-medium">PostgreSQL via Prisma</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
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
    </AppShell>
  );
}
