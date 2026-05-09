"use client";

const LOGIN_OTP_STORAGE_KEY = "login_otp_flow";

export type LoginOtpSession = {
    email: string;
    password?: string;
    redirect?: string | null;
    loginPath?: string;
};

export function readLoginOtpSession(): LoginOtpSession | null {
    if (typeof window === "undefined") return null;

    const raw = sessionStorage.getItem(LOGIN_OTP_STORAGE_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as LoginOtpSession;
    } catch {
        sessionStorage.removeItem(LOGIN_OTP_STORAGE_KEY);
        return null;
    }
}

export function writeLoginOtpSession(session: LoginOtpSession) {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(LOGIN_OTP_STORAGE_KEY, JSON.stringify(session));
}

export function clearLoginOtpSession() {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(LOGIN_OTP_STORAGE_KEY);
}
