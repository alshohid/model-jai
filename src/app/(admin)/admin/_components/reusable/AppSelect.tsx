"use client";


import Select, { StylesConfig } from "react-select";
import { cn } from "@/shared/lib/utils/cn";

export type AppSelectOption = {
    label: string;
    value: string;
    disabled?: boolean;
};

type Props = {
    value?: string;
    onValueChange?: (v: string) => void;
    options: AppSelectOption[];
    placeholder?: string;
    disabled?: boolean;

    shape?: "rounded" | "pill";
    size?: "sm" | "md";

    className?: string;
};

export default function AppSelect({
    value,
    onValueChange,
    options,
    placeholder = "Select",
    disabled,
    shape = "rounded",
    size = "sm",
    className,
}: Props) {
    const selectedOption = options.find((o) => o.value === value) || null;

    const height = size === "md" ? 70 : 48;
    const radius = shape === "pill" ? 16 : 18;

    const styles: StylesConfig<AppSelectOption, false> = {
        control: (base, state) => ({
            ...base,
            minHeight: height,
            height,
            borderRadius: radius,
            backgroundColor: "rgba(255,255,255,0.1)",
            borderColor: "rgba(255,255,255,0.15)",
            boxShadow: state.isFocused
                ? "0 0 0 1px rgba(255,255,255,0.2)"
                : "inset 0 1px 0 rgba(255,255,255,0.12)",
            cursor: "pointer",
        }),
        valueContainer: (base) => ({
            ...base,
            padding: "0 16px",
        }),
        singleValue: (base) => ({
            ...base,
            color: "#fff",
        }),
        placeholder: (base) => ({
            ...base,
            color: "rgba(255,255,255,0.85)",
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: "rgba(22,15,22,0.95)",
            backdropFilter: "blur(16px)",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden",
            zIndex: 80,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused
                ? "rgba(255,255,255,0.1)"
                : "transparent",
            color: "#fff",
            cursor: "pointer",
            borderRadius: 12,
            margin: 4,
        }),
        indicatorSeparator: () => ({ display: "none" }),
        dropdownIndicator: (base) => ({
            ...base,
            color: "#fff",
        }),
    };

    return (
        <Select
            className={cn("w-full text-sm", className)}
            isDisabled={disabled}
            value={selectedOption}
            options={options}
            placeholder={placeholder}
            styles={styles}
            onChange={(opt) => onValueChange?.(opt?.value || "")}
            isOptionDisabled={(o) => o.disabled ?? false}
        />
    );
}
