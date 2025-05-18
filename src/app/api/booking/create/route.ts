import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { startDate, endDate, flightNumber, personen, guest } = body;

  if (!startDate || !endDate || !personen || !Array.isArray(personen)) {
    return NextResponse.json({ error: "Fehlende Felder." }, { status: 400 });
  }

  const booking = await prisma.booking.create({
    data: {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      flightNumber,
      personen,
      guest: !!guest,
    },
  });

  return NextResponse.json(booking);
}