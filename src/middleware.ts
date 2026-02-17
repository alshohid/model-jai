import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get("token")?.value;
    const role = request.cookies.get("role")?.value;

    const isAuthPage =
        pathname.startsWith("/login") ||
        pathname.startsWith("/register");

    const isProtectedRoute =
        pathname.startsWith("/live-stream/match") ||
        pathname.startsWith("/user-profile") ||
        pathname.startsWith("/support-history");

    if (isProtectedRoute) {
        if (!token || role !== "user") {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    if (isAuthPage) {
        if (token && role === "user") {
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
        "/login",
        "/register",
    ],
};
