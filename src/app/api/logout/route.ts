import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true });

  res.cookies.set("auth", "", {
    path: "/",
    expires: new Date(0), // Sofort abgelaufen = löschen
  });

  return res;
}
