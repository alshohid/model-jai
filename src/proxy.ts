import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const adminToken = request.cookies.get("admin_token")?.value;
  const adminRole = request.cookies.get("admin_role")?.value;

  const isUserAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const isAdminLoginPage = pathname === "/admin";

  const isAdminProtectedRoute = pathname.startsWith("/admin/dashboard");

  const isUserProtectedRoute =
    pathname.startsWith("/live-stream/match") ||
    pathname.startsWith("/user-profile") ||
    pathname.startsWith("/payment-success") ||
    pathname.startsWith("/payment-cancel") ||
    pathname.startsWith("/support-history") ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/notifications");

  if (isAdminProtectedRoute) {
    if (!adminToken || adminRole !== "super_admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (isAdminLoginPage) {
    if (adminToken && adminRole === "super_admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  if (isUserProtectedRoute) {
    if (!token || (role !== "user" && role !== "artist")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (isUserAuthPage) {
    if (token && (role === "user" || role === "artist")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/live-stream/match/:path*",
    "/user-profile",
    "/support-history",
    "/transactions",
    "/login",
    "/register",
    "/payment-success",
    "/payment-cancel",
    "/admin",
    "/admin/dashboard/:path*",
  ],
};
