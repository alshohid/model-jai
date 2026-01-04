import Image from "next/image";
import Link from "next/link";

type MatchStatus = "Upcoming" | "Past" | "Live";

type Props = {
    status: MatchStatus;
    title: string;
    dateText: string; // e.g. "November 1, 2024"
    timeText: string; // e.g. "4:30 pm"
    gameLogoSrc: string; // "/images/games/2k26.png"
    leftPlayerImg: string; // "/images/players/p1.png"
    rightPlayerImg: string; // "/images/players/p2.png"
    watchHref: string; // "/matches/123" or external
    voteRequired?: boolean;
    className?: string;
    versusImg: string;
};

export default function MatchCard({
    status,
    title,
    dateText,
    timeText,
    gameLogoSrc,
    leftPlayerImg,
    rightPlayerImg,
    watchHref,
    voteRequired = true,
    className = "",
    versusImg
}: Props) {
    const statusStyle =
        status === "Live"
            ? "bg-red-500/25 text-red-100 border border-red-400/30"
            : status === "Past"
                ? "bg-white/10 text-white/70 border border-white/15"
                : "bg-white/10 text-white/70 border border-white/15";

    return (
        <article
            className={[
                "w-full max-w-[424px]",
                "rounded-[16px]",
                // Figma: bg #fff 6% + border #fff 20% + blur 16
                "bg-matchCardBg border border-matchCardBorder backdrop-blur-[16px]",
                // Figma: padding 32 + gap 32
                "p-[32px] flex flex-col gap-[32px]",
                className,
            ].join(" ")}
        >
            <div className="rounded-[16px] bg-[#FFFFFF0D] border border-white/10 p-4">
                <div className="flex items-center justify-between">
                    {/* left player */}
                    <div className="relative w-[150px] h-[197px] rounded-[1rem] overflow-hidden">
                        <Image
                            src={leftPlayerImg}
                            alt="Player 1"
                            fill
                            className="object-cover"
                            sizes="150px"
                            priority={false}
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center w-[44px]">
                        <Image
                            src={versusImg}
                            alt="versus"
                            width={400 }
                            height={400 }
                            className="w-full"
                            unoptimized
                        />

                    </div>

                    {/* right player */}
                    <div className="relative w-[150px] h-[197px] rounded-[16px] overflow-hidden">
                        <Image
                            src={rightPlayerImg}
                            alt="Player 2"
                            fill
                            className="object-cover"
                            sizes="150px"
                            priority={false}
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center h-[70px] w-full">
                <Image
                    src={gameLogoSrc}
                    alt="Game Logo"
                    width={460}
                    height={448}
                    className="w-full object-cover"
                    priority={false}
                />
            </div>

            <div className="flex flex-col gap-3">
                {/* Status pill */}
                <div className="flex items-center">
                    <span className={["px-3 py-1 rounded-md text-xs", statusStyle].join(" ")}>
                        {status}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-white font-semibold text-[20px] leading-tight">
                    {title}
                </h3>

                {/* Meta row */}
                <div className="flex items-center gap-6 text-white/75 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-cyan-300">🗓</span>
                        <span>{dateText}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-cyan-300">🕒</span>
                        <span>{timeText}</span>
                    </div>
                </div>
            </div>

            {/* Watch button */}
            <Link
                href={watchHref}
                className={[
                    "cursor-pointer inline-flex items-center justify-center gap-3",
                    "h-[48px] rounded-[12px]",
                    "bg-white/5 border border-white/12",
                    "text-white/80 hover:text-white transition",
                    "shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
                ].join(" ")}
            >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10">
                    ▶
                </span>
                <span className="text-sm">Watch stream</span>
            </Link>

            {/* Footer note */}
            {voteRequired && (
                <p className="text-center text-[14px] text-fuchsia-400">
                    Tiktok Vote Required
                </p>
            )}
        </article>
    );
}
