import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET as string,
  });

  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // 🔐 1. Kein Token → redirect zu /login
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ✅ 2. Token vorhanden → Rolle extrahieren
  const role = token.role as string;

  // 🔒 3. Seiten und erlaubte Rollen
  const roleRules: Record<string, string[]> = {
    "/dashboard/anfragen": ["ADMIN", "FAMILY"],
    "/dashboard/new": ["ADMIN", "FAMILY"],
    "/dashboard/gaeste": ["ADMIN", "FAMILY"],
    "/dashboard/urlaub-anfragen": ["GUEST", "ADMIN"],
    // "/dashboard" ist allgemein erlaubt für alle Rollen
  };

  // 4. Zugriff prüfen auf geschützte Unterpfade
  for (const [protectedPath, allowedRoles] of Object.entries(roleRules)) {
    if (pathname.startsWith(protectedPath)) {
      if (!allowedRoles.includes(role)) {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }
  }

  // 5. Standard: Zugriff erlaubt
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
