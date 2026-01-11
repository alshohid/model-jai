"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/shared/providers/auth/useAuth";
import AdminAuthContainer from "./auth/AdminAuthContainer";

function AdminEntryPageContent() {
    const { isAdminAuthenticated } = useAuth(); 
    const router = useRouter();
    const sp = useSearchParams();

    const redirect = sp.get("redirect") || "/admin/dashboard";

    useEffect(() => {
        if (isAdminAuthenticated) router.replace(redirect);
    }, [isAdminAuthenticated, redirect, router]);

    return <AdminAuthContainer />;
}

export default function AdminEntryPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminEntryPageContent />
        </Suspense>
    );
}
