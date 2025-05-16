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
  const pathnames = {
    "/dashboard": ["ADMIN", "FAMILY", "GUEST"],
    "/dashboard/anfragen": ["ADMIN", "FAMILY"],
    "/dashboard/new": ["ADMIN", "FAMILY"],
    "/dashboard/gaeste": ["ADMIN", "FAMILY"],
  };

  for (const [path, roles] of Object.entries(pathnames)) {
    if (url.pathname.startsWith(path) && !roles.includes((role || "") as string)) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
