// lib/actions/getBookings.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getVisibleBookings() {
  const session = await auth();
  if (!session?.user) return [];

  const userId = session.user.id;
  const role = session.user.role;

  const bookings = await prisma.booking.findMany({
    where: {
      AND: [
        role === "ADMIN" || role === "FAMILY"
          ? {}
          : {
              OR: [
                { userId }, // selbst erstellt
                {
                  companions: {
                    some: {
                      id: userId, // Begleitung bei dieser Buchung
                    },
                  },
                },
              ],
            },
        {
          status: {
            not: "REJECTED", // <- filtert REJECTED aus
          },
        },
      ],
    },
    include: {
      user: true, // Ersteller
      companions: true, // Alle Mitreisenden
    },
    orderBy: {
      startDate: "asc",
    },
  });

  return bookings;
}
