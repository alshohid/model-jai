import Image from "next/image";

type ChallengeAcceptButtonProps = {
  onClick?: () => void;
  visible?: boolean;
};

export default function ChallengeAcceptButton({
  onClick,
  visible = true,
}: ChallengeAcceptButtonProps) {
  if (!visible) return null;

  return (
    <div onClick={onClick} className="cursor-pointer">
      <Image
        src="/images/accept.PNG"
        alt="accept challenge"
        width={70}
        height={70}
        className="w-full h-full"
      />
    </div>
  );
}
