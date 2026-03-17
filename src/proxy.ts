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
    pathname.startsWith("/admin");

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

  const isPublicHomePage = pathname === "/";

  // 1) Admin protected routes
  if (isAdminProtectedRoute) {
    if (!isAdminAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // 2) Admin login page
  if (isAdminLoginPage) {
    if (isAdminAuthenticated) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // 3) User protected routes
  if (isUserProtectedRoute) {
    if (!isUserAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 4) User auth pages
  if (isUserAuthPage) {
    if (isUserAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // admin logged in থাকলে login/register এ ঢুকতে পারবে না
    if (isAdminAuthenticated) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // 5) Admin logged in থাকলে user/public root route block
  if (isAdminAuthenticated) {
    if (isPublicHomePage || isUserProtectedRoute) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
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
  ],
};

// import { NextRequest, NextResponse } from "next/server";

// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const token = request.cookies.get("token")?.value;
//   const role = request.cookies.get("role")?.value;

//   const adminToken = request.cookies.get("admin_token")?.value;
//   const adminRole = request.cookies.get("admin_role")?.value;

//   const isUserAuthPage =
//     pathname.startsWith("/login") || pathname.startsWith("/register");

//   const isAdminLoginPage = pathname === "/admin";

//   const isAdminProtectedRoute = pathname.startsWith("/admin/dashboard");

//   const isUserProtectedRoute =
//     pathname.startsWith("/live-stream/match") ||
//     pathname.startsWith("/user-profile") ||
//     pathname.startsWith("/payment-success") ||
//     pathname.startsWith("/payment-cancel") ||
//     pathname.startsWith("/support-history") ||
//     pathname.startsWith("/transactions") ||
//     pathname.startsWith("/notifications");

//   if (isAdminProtectedRoute) {
//     if (!adminToken || adminRole !== "super_admin") {
//       return NextResponse.redirect(new URL("/admin", request.url));
//     }
//   }

//   if (isAdminLoginPage) {
//     if (adminToken && adminRole === "super_admin") {
//       return NextResponse.redirect(new URL("/admin/dashboard", request.url));
//     }
//   }

//   if (isUserProtectedRoute) {
//     if (!token || (role !== "user" && role !== "artist")) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   }

//   if (isUserAuthPage) {
//     if (token && (role === "user" || role === "artist")) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/live-stream/match/:path*",
//     "/user-profile",
//     "/support-history",
//     "/transactions",
//     "/login",
//     "/register",
//     "/payment-success",
//     "/payment-cancel",
//     "/admin",
//     "/notifications",
//     "/admin/dashboard/:path*",
//   ],
// };
