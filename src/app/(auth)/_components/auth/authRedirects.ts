"use client";

import { safeRedirect } from "@/shared/UI/reusable/redirect/safeRedirect";

export const PENDING_AUTH_REDIRECT_KEY = "pending_auth_redirect";
export const PENDING_REFERRAL_KEY = "pending_referral";

/** Read a previously stored auth redirect (if any). */
export const getStoredAuthRedirect = (): string | null => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(PENDING_AUTH_REDIRECT_KEY);
};

/** Forget the stored auth redirect. */
export const clearStoredAuthRedirect = (): void => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(PENDING_AUTH_REDIRECT_KEY);
};

/** Persist the redirect so a social-login roundtrip can return here. */
export const rememberAuthRedirect = (redirect: string): void => {
    if (typeof window === "undefined" || redirect === "/") return;
    sessionStorage.setItem(PENDING_AUTH_REDIRECT_KEY, redirect);
};

/** Resolve the intended redirect: URL query param wins, else session-stored value. */
export const resolveAuthRedirect = (): string => {
    if (typeof window === "undefined") return "/";
    const fromUrl = new URLSearchParams(window.location.search).get("redirect");
    return safeRedirect(fromUrl || getStoredAuthRedirect());
};

const safelyGetReferral = (rawRedirect: string | null): string | null => {
    const redirect = safeRedirect(rawRedirect);
    const queryIndex = redirect.indexOf("?");

    if (queryIndex === -1) return null;

    return new URLSearchParams(redirect.slice(queryIndex + 1)).get("ref");
};

export const getStoredReferral = (): string | null => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(PENDING_REFERRAL_KEY);
};

export const clearStoredReferral = (): void => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(PENDING_REFERRAL_KEY);
};

/** Persist a referral code coming from the current page URL. */
export const rememberReferralFromUrl = (redirectParam: string | null): void => {
    if (typeof window === "undefined") return;

    const fromQuery = new URLSearchParams(window.location.search).get("ref");
    const referral = fromQuery || safelyGetReferral(redirectParam);

    if (referral) {
        sessionStorage.setItem(PENDING_REFERRAL_KEY, referral);
    }
};

/** Persist the redirect (URL) if it is not the home page. */
export const rememberRedirectFromUrl = (redirectParam: string | null): void => {
    if (typeof window === "undefined") return;

    const redirect = safeRedirect(redirectParam);
    if (redirect !== "/") {
        sessionStorage.setItem(PENDING_AUTH_REDIRECT_KEY, redirect);
    }
};

/** Full referral resolution order: URL ?ref → redirect → stored referral → stored redirect. */
export const resolveReferralId = (): string | null => {
    if (typeof window === "undefined") return null;

    const params = new URLSearchParams(window.location.search);
    const redirectFromUrl = params.get("redirect");
    const redirectFromStorage = sessionStorage.getItem(PENDING_AUTH_REDIRECT_KEY);

    return (
        params.get("ref") ||
        safelyGetReferral(redirectFromUrl) ||
        getStoredReferral() ||
        safelyGetReferral(redirectFromStorage)
    );
};