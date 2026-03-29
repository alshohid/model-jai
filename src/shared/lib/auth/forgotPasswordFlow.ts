"use client";

const FORGOT_PASSWORD_STORAGE_KEY = "forgot_password_flow";

export type ForgotPasswordSession = {
    email: string;
    token: string;
    otp?: string;
};

export function readForgotPasswordSession(): ForgotPasswordSession | null {
    if (typeof window === "undefined") return null;

    const raw = sessionStorage.getItem(FORGOT_PASSWORD_STORAGE_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as ForgotPasswordSession;
    } catch {
        sessionStorage.removeItem(FORGOT_PASSWORD_STORAGE_KEY);
        return null;
    }
}

export function writeForgotPasswordSession(session: ForgotPasswordSession) {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(FORGOT_PASSWORD_STORAGE_KEY, JSON.stringify(session));
}

export function mergeForgotPasswordSession(
    partial: Partial<ForgotPasswordSession>
) {
    const current = readForgotPasswordSession();
    if (!current) return;

    writeForgotPasswordSession({
        ...current,
        ...partial,
    });
}

export function clearForgotPasswordSession() {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(FORGOT_PASSWORD_STORAGE_KEY);
}
