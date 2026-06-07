import { cn } from "@/shared/lib/utils/cn";

type ChallengeAcceptButtonProps = {
  onClick?: () => void;
  className?: string;
};

export default function ChallengeAcceptButton({
  onClick,
  className,
}: ChallengeAcceptButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative grid h-[70px] w-[70px] place-items-center rounded-full",
        "border-[5px] border-[#c9a533] bg-[radial-gradient(circle_at_35%_25%,#96ff72,#10b81d_55%,#037009)]",
        "text-sm font-extrabold text-white shadow-[0_0_16px_rgba(92,255,58,0.65),inset_0_5px_10px_rgba(255,255,255,0.45)]",
        "transition hover:scale-105 active:scale-95",
        "before:absolute before:inset-1 before:rounded-full before:border before:border-white/35",
        className,
      )}
      aria-label="Accept challenge"
    >
      <span className="relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.55)]">
        Accept
      </span>
    </button>
  );
}
