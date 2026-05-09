"use client";

import { useRef, useState } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";

export function useOtpInput(length = 6) {
    const [otpDigits, setOtpDigits] = useState<string[]>(Array(length).fill(""));
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const updateDigit = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const nextDigits = [...otpDigits];
        nextDigits[index] = digit;
        setOtpDigits(nextDigits);

        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        index: number,
        event: KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pasted = event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, length);

        if (!pasted) return;

        const nextDigits = Array(length)
            .fill("")
            .map((_, index) => pasted[index] ?? "");

        setOtpDigits(nextDigits);

        const focusIndex = Math.min(pasted.length, length) - 1;
        inputRefs.current[Math.max(focusIndex, 0)]?.focus();
    };

    const reset = () => {
        setOtpDigits(Array(length).fill(""));
    };

    return {
        otpDigits,
        otp: otpDigits.join(""),
        inputRefs,
        updateDigit,
        handleKeyDown,
        handlePaste,
        reset,
    };
}
