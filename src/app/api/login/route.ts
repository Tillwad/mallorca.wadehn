import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const USER = {
  email: process.env.LOGIN_EMAIL || "",
  passwordHash: process.env.LOGIN_PASSWORD || "penis",
};

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const email = data.get("email") as string;
  const password = data.get("password") as string;

  console.log("LOGIN_EMAIL", USER.email);
  console.log("LOGIN_PASSWORD_HASH", USER.passwordHash);

  if (!USER.email || !USER.passwordHash) {
    return NextResponse.json({ error: "Serverfehler: Login nicht konfiguriert" }, { status: 500 });
  }

  if (email !== USER.email) {
    return NextResponse.json({ error: "Ungültige Zugangsdaten." }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, USER.passwordHash);

  if (!isValid) {
    return NextResponse.json({ error: "Ungültige Zugangsdaten." }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("auth", "true", {
    httpOnly: false,
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return res;
}
