import { FacebookIcon, GoogleIcon, AppleIcon } from "../icon/icon";

export function SocialButton({ kind, handleSocialLogin }: { kind: "google" | "facebook" | "apple", handleSocialLogin?: () => void }) {
    const isGoogle = kind === "google";
    const isApple = kind === "apple";

    return (
        <button
            onClick={handleSocialLogin}
            type="button"
            className={`
        cursor-pointer
        h-[44px] w-[54px]
        rounded-[10px]
        border border-white/10
        bg-white/10
        flex items-center justify-center
        backdrop-blur-[6px]
        hover:bg-white/15
        transition
        ${isApple ? "bg-black text-white border-transparent hover:brightness-110" : ""}
        `}
            aria-label={isGoogle ? "Continue with Google" : isApple ? "Continue with Apple" : "Continue with Facebook"}
        >
            {isGoogle ? <GoogleIcon /> : isApple ? <AppleIcon /> : <FacebookIcon />}
        </button>
    );
}
