"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createBooking({
  startDate,
  endDate,
  flightNumber,
  companionIds = [],
}: {
  startDate: Date | string;
  endDate: Date | string;
  flightNumber?: string;
  companionIds?: string[]; // Nur bei FAMILY erlaubt
}) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Nicht eingeloggt.");
  }

  const { id: userId, role } = session.user;

  if (!userId || !role) {
    throw new Error("Ungültige Session-Daten.");
  }

  const baseData = {
    userId,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    flightNumber: flightNumber?.trim() || null,
  };

  if (role === "FAMILY") {
    // FAMILY kann mehrere Begleitpersonen hinzufügen
    await prisma.booking.create({
      data: {
        ...baseData,
        status: "CONFIRMED",
        companions: {
          connect: companionIds.map((id) => ({ id })),
        },
      },
    });
  } else {
    // GUEST kann nur für sich selbst buchen
    await prisma.booking.create({
      data: {
        ...baseData,
        status: "PENDING",
        companions: {
          connect: [{ id: userId }],
        },
      },
    });
  }

  redirect("/dashboard");
}
