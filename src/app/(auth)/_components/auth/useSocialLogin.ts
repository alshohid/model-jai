"use client";

import {
    useAppleLoginMutation,
    useFacebookLoginMutation,
    useGoogleLoginMutation,
} from "@/redux/features/auth/authapi";
import { executeSocialLogin } from "@/shared/lib/auth/socialLogin";

import { rememberAuthRedirect } from "./authRedirects";

/**
 * Shared social-login orchestration for both Login and Register forms.
 *
 * `getRedirect` is a lazy resolver so each caller controls which redirect to
 * persist before the social round-trip (URL param vs. session storage).
 */
export function useSocialLogin(getRedirect: () => string) {
    const [googleLogin] = useGoogleLoginMutation();
    const [facebookLogin] = useFacebookLoginMutation();
    const [appleLogin] = useAppleLoginMutation();

    const handleSocialLogin = async (loginFn: () => Promise<unknown>) => {
        rememberAuthRedirect(getRedirect());
        await executeSocialLogin(loginFn);
    };

    const handleGoogleLogin = () =>
        handleSocialLogin(() => googleLogin().unwrap());
    const handleAppleLogin = () =>
        handleSocialLogin(() => appleLogin().unwrap());
    const handleFacebookLogin = () =>
        handleSocialLogin(() => facebookLogin().unwrap());

    return {
        handleGoogleLogin,
        handleAppleLogin,
        handleFacebookLogin,
    };
}