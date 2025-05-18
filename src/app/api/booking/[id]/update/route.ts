import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const body = await req.json();
  const { startDate, endDate, flightNumber, personen, guest } = body;

  try {
    const updated = await prisma.booking.update({
      where: { id },
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        flightNumber,
        personen,
        guest: !!guest,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Nicht gefunden oder Fehler." }, { status: 404 });
  }
}