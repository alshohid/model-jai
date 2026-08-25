import { SocialButton } from "@/shared/UI/button/SocialButton";

type SocialLoginButtonsProps = {
    onGoogle: () => void;
    onApple: () => void;
    onFacebook: () => void;
};

export function SocialLoginButtons({
    onGoogle,
    onApple,
    onFacebook,
}: SocialLoginButtonsProps) {
    return (
        <div className="mt-6 flex items-center justify-center gap-3">
            <SocialButton kind="google" handleSocialLogin={onGoogle} />
            <SocialButton kind="apple" handleSocialLogin={onApple} />
            <SocialButton kind="facebook" handleSocialLogin={onFacebook} />
        </div>
    );
}