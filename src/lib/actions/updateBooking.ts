"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateBooking({
  bookingId,
  startDate,
  endDate,
  flightNumber,
  withUserId,
}: {
  bookingId: string;
  startDate: Date | string;
  endDate: Date | string;
  flightNumber?: string;
  withUserId?: string | null;
}) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Nicht eingeloggt.");
  }

  if (!session?.user?.id) {
    throw new Error("User-ID fehlt in der Session.");
  }

  console.log("Session:", session);
  console.log("User ID:", session?.user?.id);

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      userId: session.user.id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      flightNumber: flightNumber?.trim() || null,
      withUserId: withUserId || null,
      status: "PENDING",
    },
  });

  redirect("/dashboard");
}