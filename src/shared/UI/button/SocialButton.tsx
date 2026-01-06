import { FacebookIcon, GoogleIcon } from "../icon/icon";

export function SocialButton({ kind }: { kind: "google" | "facebook" }) {
    const isGoogle = kind === "google";
    return (
        <button
            type="button"
            className="
        cursor-pointer
        h-[44px] w-[54px]
        rounded-[10px]
        border border-white/10
        bg-white/10
        flex items-center justify-center
        backdrop-blur-[6px]
        hover:bg-white/15
        transition
        "
            aria-label={isGoogle ? "Continue with Google" : "Continue with Facebook"}
        >
            {isGoogle ? <GoogleIcon /> : <FacebookIcon />}
        </button>
    );
}
