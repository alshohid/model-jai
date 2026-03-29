import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const adminToken = request.cookies.get("admin_token")?.value;
  const adminRole = request.cookies.get("admin_role")?.value;

  const isAdminAuthenticated = !!adminToken && adminRole === "super_admin";
  const isUserAuthenticated = !!token && (role === "user" || role === "artist");

  const isUserAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  const isAdminLoginPage = pathname === "/admin";
  const isAdminProtectedRoute = pathname.startsWith("/admin/dashboard");

  const isUserProtectedRoute =
    pathname.startsWith("/live-stream/match") ||
    pathname.startsWith("/user-profile") ||
    pathname.startsWith("/payment-success") ||
    pathname.startsWith("/payment-cancel") ||
    pathname.startsWith("/support-history") ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/artist");

  const isPublicHomePage = pathname === "/";

  // 1) user/artist logged in থাকলে admin route block
  if ((isAdminLoginPage || isAdminProtectedRoute) && isUserAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2) admin protected route
  if (isAdminProtectedRoute) {
    if (!isAdminAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // 3) admin login page
  if (isAdminLoginPage) {
    if (isAdminAuthenticated) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 4) user protected route
  if (isUserProtectedRoute) {
    if (!isUserAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAdminAuthenticated) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // 5) user auth pages
  if (isUserAuthPage) {
    if (isUserAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isAdminAuthenticated) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // 6) admin logged in থাকলে public home block
  if (isAdminAuthenticated && isPublicHomePage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/live-stream/match/:path*",
    "/user-profile",
    "/support-history",
    "/transactions",
    "/notifications",
    "/login",
    "/register",
    "/payment-success",
    "/payment-cancel",
    "/admin",
    "/admin/dashboard/:path*",
    "/artist/:path*",
    "/forgot-password",
    "/forgot-password/verify",
    "/forgot-password/reset",
  ],
};
