"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/store";
import { handleSocialAuth } from "@/shared/lib/auth/handleSocialCallback";

type SocialCallbackPageProps = {
    provider?: string;
};

export default function SocialCallbackPage({
    provider = "social",
}: SocialCallbackPageProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const encodedData = searchParams.get("data");

    useEffect(() => {
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
    }, [dispatch, encodedData, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 to-black">
            <div className="text-center">
                <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent" />
                <p className="text-lg text-white">
                    Completing {provider} sign in...
                </p>
                <p className="mt-2 text-sm text-white/50">
                    This window will close automatically
                </p>
            </div>
        </div>
    );
}
