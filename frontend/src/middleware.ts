import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const currentPath = request.nextUrl.pathname;

  const protectedRoutes = ["/", "/dashboard", "/profile"];
  const authRoutes = ["/login", "/register"];

  if (!token && protectedRoutes.includes(currentPath)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && authRoutes.includes(currentPath)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
