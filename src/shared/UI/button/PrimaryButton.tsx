
export function PrimaryButton({ text, variant = "pink", isloading = false, loadingText = "Processing" }: { text: string; variant?: "pink" | "blue", isloading: boolean, loadingText:string }) {
    const isPink = variant === "pink";
    return (
        <button
            type="submit"
            disabled={isloading}
            className={[
                "w-full cursor-pointer rounded-[10px] px-4 py-3",
                "text-[16px] font-semibold tracking-wide",
                "shadow-[0_10px_22px_rgba(0,0,0,0.35)]",
                "transition-transform duration-150 active:scale-[0.99]",
                isPink
                    ? "bg-[#FF00C8] text-white"
                    : "bg-[#11B5FF] text-[#0B0D12]",
            ].join(" ")}
        >
            {isloading? loadingText:text}
        </button>
    );
}
