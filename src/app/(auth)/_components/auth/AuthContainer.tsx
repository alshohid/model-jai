/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import AuthPageShell from "./AuthPageShell";

type Mode = "/login" | "/register" | any;

export default function AuthContainer() {
    const pathname = usePathname();
    const [mode, setMode] = React.useState<Mode>(pathname);

    return (
        <AuthPageShell>
            {mode === "/login" ? (
                <LoginForm onGoRegister={() => setMode("/register")} />
            ) : (
                <RegisterForm onGoLogin={() => setMode("/login")} />
            )}
        </AuthPageShell>
    );
}
