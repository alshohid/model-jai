import { SupportSide } from "@/shared/components/watchLive/types";
import { cn } from "@/shared/lib/utils/cn";
import { ChevronDown } from "lucide-react";

export function TipCaretButton({
    side,
    isOpen,
    onClick,
    children,
}: {
    side: SupportSide;
    isOpen: boolean;
    onClick: () => void;
    children?: React.ReactNode;
}) {
    return (
        <div className="relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-[20]">
                <button
                    data-tip-caret={side}
                    type="button"
                    onClick={onClick}
                    className={cn(
                        "h-7 w-10 rounded-full",
                        "bg-black/55 border border-white/10 backdrop-blur-md",
                        "flex items-center justify-center",
                        "hover:bg-black/65 transition"
                    )}
                    aria-label="Tip menu"
                >
                    <ChevronDown
                        className={cn(
                            "h-5 w-5 text-white/90 transition-transform duration-200",
                            isOpen ? "rotate-180" : "rotate-0"
                        )}
                    />
                </button>
                {children}
            </div>
        </div>
    );
}
