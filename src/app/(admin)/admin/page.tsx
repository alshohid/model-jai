"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/shared/providers/auth/useAuth";
import AdminAuthContainer from "./auth/AdminAuthContainer";


export default function AdminEntryPage() {
    const { isAdminAuthenticated } = useAuth(); 
    const router = useRouter();
    const sp = useSearchParams();

    const redirect = sp.get("redirect") || "/admin/dashboard";

    useEffect(() => {

        if (isAdminAuthenticated) router.replace(redirect);
    }, [isAdminAuthenticated, redirect, router]);

    return <AdminAuthContainer />;
}
