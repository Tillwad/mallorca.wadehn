"use server";

import { auth } from "@/auth";

export async function getCurrentUserId() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user.id;
}

export async function getCurrentUserRole() {
  const session = await auth();
  if (!session?.user?.role) return null;
  return session.user.role;
}