import Image from "next/image";

type ChallengeAcceptedButtonProps = {
    visible?: boolean;
};

export default function ChallengeAcceptedButton({
    visible = true,
}: ChallengeAcceptedButtonProps) {
    if (!visible) return null;

    return (
        <div className="cursor-default w-full h-full flex items-center justify-center">
            <Image
                src="/images/accepted-button.png"
                alt="challenge accepted"
                width={320}
                height={120}
                unoptimized
                className="w-full h-auto object-contain"
            />
        </div>
    );
}