// lib/actions/updateBookingStatus.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function updateBookingStatus({
  bookingId,
  newStatus,
}: {
  bookingId: string;
  newStatus: "CONFIRMED" | "REJECTED" | "PENDING";
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "FAMILY"].includes(session.user.role)) {
    throw new Error("Nicht autorisiert");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: newStatus },
  });
}
