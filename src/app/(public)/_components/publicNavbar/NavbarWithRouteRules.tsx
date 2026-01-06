"use client";

import RouteGate from "@/shared/providers/route/RouteGate";
import PublicNavbar from "./PublicNavbar";



export default function NavbarWithRouteRules() {
    return (
        <RouteGate
            when={(p) => !p.startsWith("/login") && !p.startsWith("/register")}
            fallback={null}
        >
            <PublicNavbar />
        </RouteGate>
    );
}
