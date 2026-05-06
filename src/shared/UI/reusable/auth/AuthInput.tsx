import { AuthInputProps } from "@/types/authType/AuthTypes";
import { useState } from "react";

function EyeOpenIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function EyeClosedIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );
}

export function AuthInput({
    label,
    type = "text",
    icon,
    register,
    name,
    readOnly = false,
    required = true,
}: AuthInputProps) {
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);

    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className="relative">
            <div
                className="
                flex items-center gap-3
                w-full
                rounded-[8px]
                border border-white/10
                bg-white/10
                px-4 py-3
                backdrop-blur-[6px]
                "
            >
                <div className="opacity-70">{icon}</div>
                <input
                    type={resolvedType}
                    readOnly={readOnly}
                    placeholder={label}
                    className="
                    w-full bg-transparent outline-none
                    text-white/90 placeholder:text-white/35
                    text-[0.75rem] md:text-[0.87rem]
                    "
                    {...register(name, { required })}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="opacity-40 hover:opacity-80 transition-opacity duration-200 text-white flex-shrink-0 cursor-pointer"
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                    </button>
                )}
            </div>
        </div>
    );
}
