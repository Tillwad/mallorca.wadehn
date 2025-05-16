"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { hash } from "bcryptjs";

export async function changePassword(newPassword: string): Promise<{ error?: string } | void> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Nicht eingeloggt." };
  }

  if (newPassword.length < 6) {
    return { error: "Passwort muss mindestens 6 Zeichen lang sein." };
  }

  const passwordHash = await hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      passwordHash,
      mustChangePassword: false,
    },
  });
}
