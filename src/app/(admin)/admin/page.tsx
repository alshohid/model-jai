"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminAuthContainer from "./auth/AdminAuthContainer";
import { useAuth } from "@/redux/features/auth/hooks";

function AdminEntryPageContent() {
    const { isAuthenticated, role } = useAuth();
    const router = useRouter();
    const sp = useSearchParams();

    const redirect = sp.get("redirect") || "/admin/dashboard";

    useEffect(() => {
        if (isAuthenticated && role === "super_admin") router.replace(redirect);
    }, [isAuthenticated, role, redirect, router]);

    return <AdminAuthContainer />;
}

export default function AdminEntryPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminEntryPageContent />
        </Suspense>
    );
}
