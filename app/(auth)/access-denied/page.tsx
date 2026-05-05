import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Access denied</CardTitle>
          <CardDescription>
            Your account does not have permission to open that dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/login">Return to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
