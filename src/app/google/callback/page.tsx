"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/store";
import Cookies from "js-cookie";
import { setCredentials } from "@/redux/features/auth/authSlice";

export default function GoogleCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const encodedData = searchParams.get("data");

        if (!encodedData) {
            router.push("/login");
            return;
        }

        try {

            const urlDecoded = decodeURIComponent(encodedData);

            const base64Decoded = atob(urlDecoded);
            const parsedData = JSON.parse(base64Decoded);
            console.log("parsedData", parsedData);

            const { access_token, user } = parsedData;
            Cookies.set("token", access_token);
            Cookies.set("role", user.role);

            dispatch(
                setCredentials({
                    token: access_token,
                    role: user.role,
                    refreshToken: null,
                })
            );

            router.push("/");

        } catch (error) {
            console.error("Google login decode error:", error);
            router.push("/login");
        }
    }, [searchParams, router, dispatch]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black">
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
