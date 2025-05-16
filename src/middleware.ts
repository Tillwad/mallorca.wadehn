import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET as string });

  const url = req.nextUrl.clone();

  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const role = token.role;

  if (url.pathname.startsWith("/admin") && role !== "ADMIN") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (
    url.pathname.startsWith("/dashboard/anfragen") &&
    !["ADMIN", "FAMILY"].includes((role || "") as string)
  ) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/requests/:path*"],
};
