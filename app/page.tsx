import { redirectAuthenticatedUser } from "@/lib/auth/session";

export default async function Home() {
  await redirectAuthenticatedUser({ unauthenticatedTo: "/login" });

  return null;
}
