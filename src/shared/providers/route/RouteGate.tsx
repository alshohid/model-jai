"use client";

import React from "react";
import { useRoute } from "./RouteProvider";

type Props = {
    when: string | RegExp | ((pathname: string) => boolean);
    children: React.ReactNode;
    fallback?: React.ReactNode;
    waitForHydration?: boolean; 
};

export default function RouteGate({
    when,
    children,
    fallback = null,
    waitForHydration = true,
}: Props) {
    const { pathname, isReady } = useRoute();

    if (waitForHydration && !isReady) return fallback;

    const ok =
        typeof when === "function"
            ? when(pathname)
            : when instanceof RegExp
                ? when.test(pathname)
                : pathname === when;

    return ok ? <>{children}</> : <>{fallback}</>;
}
