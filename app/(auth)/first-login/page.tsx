import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { FirstLoginForm } from "@/components/auth/first-login-form";
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
    <AuthShell title="Change password">
      <FirstLoginForm token={token} />
    </AuthShell>
  );
}
