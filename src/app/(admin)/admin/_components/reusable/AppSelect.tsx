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
            overflow: "hidden",
        }),
        singleValue: (base) => ({
            ...base,
            color: "#fff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
        }),
        input: (base) => ({
            ...base,
            margin: 0,
            padding: 0,
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
        menuList: (base) => ({
            ...base,
            padding: "4px",
            overflowX: "hidden", // Hide horizontal scrollbar
            overflowY: "auto",
            maxHeight: "300px",
            "&::-webkit-scrollbar": {
                width: "4px",
            },
            "&::-webkit-scrollbar-track": {
                background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
                background: "#00C3FF",
                borderRadius: "2px",
            },
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
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
        }),
        indicatorSeparator: () => ({ display: "none" }),
        dropdownIndicator: (base) => ({
            ...base,
            color: "#fff",
        }),
    };

    return (
        <div className={cn("w-full", className)}>
            <Select
                className="text-sm react-select-no-horizontal-scroll"
                classNamePrefix="react-select"
                isDisabled={disabled}
                value={selectedOption}
                options={options}
                placeholder={placeholder}
                styles={styles}
                onChange={(opt) => onValueChange?.(opt?.value || "")}
                isOptionDisabled={(o) => o.disabled ?? false}
            />
        </div>
    );
}
