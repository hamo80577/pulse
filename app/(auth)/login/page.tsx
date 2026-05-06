import { redirectAuthenticatedUser } from "@/lib/auth/session";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  await redirectAuthenticatedUser();

  return (
    <AuthShell title="Login">
      <LoginForm />
    </AuthShell>
  );
}
