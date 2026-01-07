
import { cn } from "@/shared/lib/utils/cn";
export function CircleNavButton({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={dir === "prev" ? "Previous" : "Next"}
            className={cn(
                "pointer-events-auto cursor-pointer",
                "w-8 h-8 rounded-full",
                "bg-[#FF3DBB] hover:bg-[#ff2eb4]",
                "flex items-center justify-center",
                "shadow-[0_14px_40px_rgba(0,0,0,0.45)]",
                "transition"
            )}
        >
            <span className="text-white text-lg leading-none select-none">{dir === "prev" ? "‹" : "›"}</span>
        </button>
    );
}