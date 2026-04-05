"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/store";
import { handleSocialAuth } from "@/shared/lib/auth/handleSocialCallback";

export default function AppleCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    useEffect(() => {
        const encodedData = searchParams.get("data");

        if (!encodedData) {
            router.replace("/login");
            return;
        }
        try {
            handleSocialAuth(encodedData, dispatch);
            router.replace("/");
        } catch {
            router.replace("/login");
        }
    }, [searchParams, router, dispatch]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 to-black">
            <div className="text-center">
                <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent"></div>
                <p className="text-lg text-white">Completing sign in...</p>
                <p className="mt-2 text-sm text-white/50">
                    This window will close automatically
                </p>
            </div>
        </div>
    );
}
