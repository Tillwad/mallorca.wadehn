import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { RouteContext } from "next";

export async function DELETE(req: NextRequest, context: RouteContext) {
  const id = context.params.id;

  try {
    await prisma.booking.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  }
}

export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
  const id = context.params.id;
  const body = await req.json();

  if (!id || !body) {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

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