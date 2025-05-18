import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const bookings = await prisma.booking.findMany({
    orderBy: { startDate: "asc" },
  });
  return NextResponse.json(bookings);
}