"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function deleteBooking(bookingId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Nicht eingeloggt.");
  }

  if (!session?.user?.id) {
    throw new Error("User-ID fehlt in der Session.");
  }

  console.log("Session:", session);
  console.log("User ID:", session?.user?.id);

  await prisma.booking.delete({
    where: {
      id: bookingId,
    },
  });

  redirect("/dashboard");
}