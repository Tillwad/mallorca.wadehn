"use server";

import { signOut } from "@/auth"; // Achtung: aus `@/auth`, nicht `next-auth/react`
import { redirect } from "next/navigation";

export async function logout() {
  await signOut(); // beendet die Auth-Session
  redirect("/login"); // danach weiterleiten
}
