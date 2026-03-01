import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/dashboard", "/technicians", "/bookings"];
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  let isValid = false;

  if (token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  if (isProtectedRoute && !isValid) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthRoute && isValid) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/technicians/:path*", "/bookings/:path*", "/login", "/register", "/forgot-password", "/reset-password"]
};
