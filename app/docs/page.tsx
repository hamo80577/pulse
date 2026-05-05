import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const documents = [
  {
    title: "Blueprint and Sitemap",
    description: "Product modules, role navigation, journeys, and MVP definition.",
    path: "docs/BLUEPRINT_SITEMAP.md",
  },
  {
    title: "Phase Execution Plan",
    description: "Phase-by-phase delivery order and acceptance expectations.",
    path: "docs/PHASES.md",
  },
  {
    title: "Phase 0 Spec",
    description: "Bootstrap scope, tooling, scripts, validation, and acceptance criteria.",
    path: "docs/specs/phase-00-project-bootstrap.md",
  },
];

export default function DocsPage() {
  return (
    <AppShell>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <div className="flex flex-col gap-3">
          <Link className="text-sm text-muted-foreground hover:text-foreground" href="/">
            Back to foundation
          </Link>
          <h1 className="text-3xl font-semibold tracking-normal text-foreground">
            Project documentation
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            Phase 0 keeps documentation close to the codebase. These files are
            available in the repository for planning and implementation review.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {documents.map((document) => (
            <Card key={document.path}>
              <CardHeader>
                <CardTitle>{document.title}</CardTitle>
                <CardDescription>{document.path}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {document.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </AppShell>
  );
}
