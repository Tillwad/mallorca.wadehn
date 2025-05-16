"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function createGuest({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { success: false, error: "E-Mail bereits vergeben" };

  const passwordHash = await hash("login123", 10);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "GUEST",
    },
  });

  return { success: true };
}
