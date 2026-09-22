import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/auth-options";

export async function getAppSession() {
  return getServerSession(authOptions);
}

export async function getUserRole() {
  const session = await getAppSession();
  return session?.user?.role ?? null;
}

export async function isAdminRequest() {
  const role = await getUserRole();
  return role === "ADMIN";
}

export async function requireAdmin() {
  const session = await getAppSession();
  if (session?.user?.role !== "ADMIN") {
    const { redirect } = await import("next/navigation");
    redirect("/login");
  }
  return session;
}
