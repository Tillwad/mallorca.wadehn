"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getAllUsers() {
  const session = await auth();
  if (!session?.user) return [];

  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      role: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}
