"use client";

import type {
    ClipboardEvent,
    KeyboardEvent,
    MutableRefObject,
} from "react";

type Props = {
    digits: string[];
    inputRefs: MutableRefObject<Array<HTMLInputElement | null>>;
    onDigitChange: (index: number, value: string) => void;
    onKeyDown: (
        index: number,
        event: KeyboardEvent<HTMLInputElement>,
    ) => void;
    onPaste: (event: ClipboardEvent<HTMLInputElement>) => void;
};

export default function OtpCodeFieldGroup({
    digits,
    inputRefs,
    onDigitChange,
    onKeyDown,
    onPaste,
}: Props) {
    return (
        <div className="mt-2.5 grid grid-cols-3 gap-2 sm:mt-3 sm:grid-cols-6 sm:gap-3">
            {digits.map((digit, index) => (
                <input
                    key={index}
                    ref={(element) => {
                        inputRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(event) => onDigitChange(index, event.target.value)}
                    onKeyDown={(event) => onKeyDown(index, event)}
                    onPaste={onPaste}
                    className="h-11 w-full min-w-0 rounded-[12px] border border-white/10 bg-white/8 text-center text-base font-semibold text-white outline-none transition focus:border-[#FF2EC8]/60 focus:bg-[#FF2EC8]/8 sm:h-14 sm:rounded-[16px] sm:text-xl"
                />
            ))}
        </div>
    );
}
