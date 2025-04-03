import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const currentPath = request.nextUrl.pathname;

  console.log("Middleware - Path:", currentPath);
  console.log("Middleware - Token from cookie:", token);

  const protectedRoutes = ["/", "/profile", "/update-profile", "/settings"];
  const authRoutes = ["/login", "/register"];

  if (!token && protectedRoutes.includes(currentPath)) {
    console.log("Redirecting to /login - No token found");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && authRoutes.includes(currentPath)) {
    console.log("Redirecting to / - Already authenticated");
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/profile",
    "/login",
    "/register",
    "/settings",
    "/update-profile",
  ],
};
