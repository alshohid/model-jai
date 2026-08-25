"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    useRegisterUserMutation,
} from "@/redux/features/auth/authapi";
import { IAuthRegisterParams } from "@/types/user/auth";

import {
    clearStoredReferral,
    rememberRedirectFromUrl,
    rememberReferralFromUrl,
    resolveAuthRedirect,
    resolveReferralId,
} from "./authRedirects";
import { useSocialLogin } from "./useSocialLogin";

const normalizeOptionalText = (value?: string | null): string | null => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
};

export function useRegister() {
    const router = useRouter();
    const [registerUser, { isLoading }] = useRegisterUserMutation();

    // Remember the redirect + referral from the URL once, on mount.
    useEffect(() => {
        if (typeof window === "undefined") return;

        const redirectParam = new URLSearchParams(
            window.location.search,
        ).get("redirect");

        rememberRedirectFromUrl(redirectParam);
        rememberReferralFromUrl(redirectParam);
    }, []);

    const {
        handleGoogleLogin,
        handleAppleLogin,
        handleFacebookLogin,
    } = useSocialLogin(() => resolveAuthRedirect());

    const submitRegistration = async (
        data: IAuthRegisterParams,
        selectedGameId?: number | null,
    ): Promise<boolean> => {
        const payload: IAuthRegisterParams = {
            ...data,
            first_name: data.first_name.trim(),
            middle_name: normalizeOptionalText(data.middle_name),
            last_name: data.last_name.trim(),
            artist_name: data.artist_name.trim(),
            address: normalizeOptionalText(data.address),
            city: normalizeOptionalText(data.city),
            zip_code: normalizeOptionalText(data.zip_code),
            state: normalizeOptionalText(data.state),
            social_verification_status: Boolean(data.social_verification_status),
            social_verification_number: data.social_verification_status
                ? normalizeOptionalText(data.social_verification_number)
                : null,
            game_id: selectedGameId ?? null,
            referral_id: resolveReferralId(),
        };

        const result = await registerUser(payload);

        if ("data" in result) {
            const redirect = resolveAuthRedirect();
            const loginParams = new URLSearchParams();

            if (redirect !== "/") {
                loginParams.set("redirect", redirect);
            }

            clearStoredReferral();
            toast.success(
                result.data?.message ?? "User registered successfully",
            );

            router.push(
                "/login" + (loginParams.toString() ? "?" + loginParams.toString() : ""),
            );
            return true;
        }

        const error = (result as { error?: { data?: { message?: string } } })
            .error;
        toast.error(error?.data?.message ?? "Something went wrong");
        return false;
    };

    return {
        isLoading,
        handleGoogleLogin,
        handleAppleLogin,
        handleFacebookLogin,
        submitRegistration,
    };
}