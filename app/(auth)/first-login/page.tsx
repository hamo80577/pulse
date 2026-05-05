import { redirect } from "next/navigation";
import { FirstLoginForm } from "@/components/auth/first-login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth/session";
import { getDashboardPathForRole, requiresFirstLogin } from "@/lib/auth/routing";

export default async function FirstLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const [{ token }, session] = await Promise.all([searchParams, getCurrentSession()]);

  if (session && !requiresFirstLogin(session.user)) {
    redirect(getDashboardPathForRole(session.user.role));
  }

  if (!session && !token) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set your Pulse password</CardTitle>
          <CardDescription>
            Create a strong password before continuing to your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FirstLoginForm token={token} />
        </CardContent>
      </Card>
    </main>
  );
}
