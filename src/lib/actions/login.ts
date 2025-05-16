"use server";

import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";

export type LoginState = { error: string } | { redirectTo: string } | null;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "E-Mail und Passwort erforderlich." };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { error: "Benutzer nicht gefunden." };
  }

  // normaler Login
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (user.mustChangePassword) {
      return { redirectTo: "/passwort-aendern" };
    }
    return { redirectTo: "/dashboard" };
  } catch (error) {
    console.error("❌ Login Fehler:", error);
    return { error: "Login fehlgeschlagen." };
  }
}
