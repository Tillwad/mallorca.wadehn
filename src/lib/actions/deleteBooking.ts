"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function deleteBooking(bookingId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Nicht eingeloggt oder keine User-ID.");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { companions: true }, // optional für Logging oder Prüfung
  });

  if (!booking) {
    throw new Error("Buchung existiert nicht oder wurde bereits gelöscht.");
  }

  // Verknüpfungen löschen (z. B. bei many-to-many)
  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      companions: { set: [] },
      // travelers: { set: [] }, // falls vorhanden
    },
  });

  await prisma.booking.delete({
    where: { id: bookingId },
  });

  redirect("/anfragen");
}
