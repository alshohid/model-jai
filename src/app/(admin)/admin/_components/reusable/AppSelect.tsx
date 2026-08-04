"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    /** form = match admin inputs; toolbar = list page controls */
    variant?: "form" | "toolbar";
    /** Adds a "Select one" style option that clears the value. Default on for form. */
    withPlaceholderOption?: boolean;
    shape?: "rounded" | "pill";
    size?: "sm" | "md";
    className?: string;
    triggerClassName?: string;
};

const EMPTY_VALUE = "__app_select_empty__";

const formTriggerClassName =
    "h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3.5 text-sm text-white shadow-none outline-none transition-all duration-200 focus-visible:border-[#FF2EC8]/60 focus-visible:bg-[#FF2EC8]/5 focus-visible:ring-0 data-[placeholder]:text-white/25 data-[size=default]:h-11 [&_svg]:text-white/50";

const toolbarTriggerClassName =
    "h-10 w-full rounded-[12px] border border-white/10 bg-white/5 px-3 text-sm text-white/85 shadow-none outline-none transition-colors focus-visible:border-[#FF2EC8]/40 focus-visible:ring-0 data-[placeholder]:text-white/40 data-[size=default]:h-10 sm:h-12 sm:rounded-[18px] sm:border-white/15 sm:bg-white/10 sm:px-4 sm:data-[size=default]:h-12 sm:data-[placeholder]:text-white/70 [&_svg]:text-white/55 sm:[&_svg]:text-white";

const contentClassName =
    "z-[220] rounded-lg border border-white/10 bg-[#160F16]/95 p-1 text-white backdrop-blur-xl";

const itemClassName =
    "cursor-pointer rounded-md px-2.5 py-2 text-white focus:bg-white/10 focus:text-white data-[disabled]:opacity-40";

export default function AppSelect({
    value,
    onValueChange,
    options,
    placeholder = "Select one",
    disabled,
    variant = "form",
    withPlaceholderOption,
    shape = "rounded",
    size = "sm",
    className,
    triggerClassName,
}: Props) {
    const isToolbar = variant === "toolbar";
    const showPlaceholderOption =
        withPlaceholderOption ?? variant === "form";
    const heightClass =
        isToolbar && size === "md"
            ? "h-[70px] data-[size=default]:h-[70px] sm:h-[70px] sm:data-[size=default]:h-[70px]"
            : null;
    const radiusClass =
        isToolbar && shape === "pill" ? "rounded-2xl sm:rounded-2xl" : null;

    const selectValue = value
        ? value
        : showPlaceholderOption
          ? EMPTY_VALUE
          : undefined;

    return (
        <div className={cn("w-full", className)}>
            <Select
                value={selectValue}
                onValueChange={(next) => {
                    onValueChange?.(next === EMPTY_VALUE ? "" : next);
                }}
                disabled={disabled}
            >
                <SelectTrigger
                    className={cn(
                        isToolbar ? toolbarTriggerClassName : formTriggerClassName,
                        heightClass,
                        radiusClass,
                        !value && "text-white/25",
                        triggerClassName,
                    )}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent position="popper" className={contentClassName}>
                    {showPlaceholderOption ? (
                        <SelectItem
                            value={EMPTY_VALUE}
                            className={cn(itemClassName, "text-white/40")}
                        >
                            {placeholder}
                        </SelectItem>
                    ) : null}
                    {options
                        .filter((option) => option.value !== "")
                        .map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                                className={itemClassName}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                </SelectContent>
            </Select>
        </div>
    );
}
