import Image from "next/image";



type ChallengeAcceptButtonProps = {
  onClick?: () => void;

};

export default function ChallengeAcceptButton({
  onClick,
}: ChallengeAcceptButtonProps) {
  return (
    <div onClick={onClick} className="cursor-pointer" >
      <Image src="/images/accept.PNG" alt="accept challenge" width={70} height={70} className="w-full h-full" />
    </div>

  );
}
