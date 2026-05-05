import { redirectAuthenticatedUser } from "@/lib/auth/session";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage() {
  await redirectAuthenticatedUser();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Pulse
          </p>
          <h1 className="text-3xl font-semibold tracking-normal text-foreground">
            Operations Workforce Portal
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Sign in to manage Pickers, Champs, approvals, and branch workforce
            operations.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Secure internal access</CardTitle>
            <CardDescription>
              Secure internal access for Operations, Admins, Champs, and Pickers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
