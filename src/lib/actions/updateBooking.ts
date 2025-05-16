"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

type User = {
  id: string;
  name: string;
  role: "ADMIN" | "FAMILY" | "GUEST";
};

export async function updateBooking({
  bookingId,
  startDate,
  endDate,
  flightNumber,
  companionIds = [],
}: {
  bookingId: string;
  startDate: Date | string;
  endDate: Date | string;
  flightNumber?: string;
  companionIds?: User[]; // Nur bei FAMILY erlaubt
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
      companions: {
        connect: companionIds.map((companion) => ({
          id: companion.id,
        })),
      },
      status: "PENDING",
    },
  });

  redirect("/dashboard");
}
