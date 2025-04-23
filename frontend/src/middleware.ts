import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isStaticFile = /\.(.*)$/.test(pathname);
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  if (isStaticFile) {
    return NextResponse.next();
  }

  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
