import WatchStreamButton from "@/shared/UI/button/WatchStreamButton";
import Image from "next/image";


type MatchStatus = "Upcoming" | "Past" | "Live";

type Props = {
    status: MatchStatus;
    title: string;
    dateText: string;
    timeText: string;
    gameLogoSrc: string;
    leftPlayerImg: string;
    rightPlayerImg: string;
    watchHref: string;
    voteRequired?: boolean;
    className?: string;
    versusImg: string;
    onWatch?: () => any;
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
    versusImg,
    onWatch
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
                "w-full max-w-[320px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-[424px]",
                "rounded-[16px]",
                "bg-matchCardBg border border-matchCardBorder backdrop-blur-[16px]",
                "p-5 sm:p-8",
                "flex flex-col",
                className,
            ].join(" ")}
        >
            <div>
                {/* VS block */}
                <div className="rounded-[16px] bg-[#FFFFFF0D] border border-white/10 p-3 sm:p-4">
                    <div className="flex items-center justify-between gap-3">
                        {/* left player */}
                        <div className="relative overflow-hidden rounded-[16px]
                          w-[clamp(80px,28vw,120px)] aspect-[150/197] shrink-0">
                            <Image
                                src={leftPlayerImg}
                                alt="Player 1"
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 28vw, 150px"
                            />
                        </div>

                        {/* vs */}
                        <div className="shrink-0 w-[clamp(18px,6vw,44px)] flex items-center justify-center">
                            <Image
                                src={versusImg}
                                alt="versus"
                                width={120}
                                height={120}
                                className="w-full h-auto"
                                unoptimized
                            />
                        </div>

                        {/* right player */}
                        <div className="relative overflow-hidden rounded-[16px]
                        w-[clamp(80px,28vw,120px)] aspect-[150/197] shrink-0">
                            <Image
                                src={rightPlayerImg}
                                alt="Player 2"
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 28vw, 150px"
                            />
                        </div>
                    </div>
                </div>

                {/* Game logo (no cropping) */}
                <div className="relative w-full h-[100px]">
                    <Image
                        src={gameLogoSrc}
                        alt="Game Logo"
                        fill
                        className="h-full w-full object-contain"
                    // sizes="(max-width: 640px) 80vw, 360px"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center">
                        <span className={["px-3 py-1 rounded-md text-xs", statusStyle].join(" ")}>
                            {status}
                        </span>
                    </div>

                    <h3 className="text-white font-semibold text-[18px] sm:text-[20px] leading-tight">
                        {title}
                    </h3>

                    {/* ✅ wrap on small screens */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/75 text-sm">
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

                <div className="mt-3 md:mt-5">
                    <WatchStreamButton
                        label="Watch Now"
                        onClick={onWatch}
                    />
                </div>


                {voteRequired && (
                    <p className="text-center text-[1rem] mt-2 md:mt-3 font-medium text-[#FF2EC8]">
                        Tiktok Vote Required
                    </p>
                )}

            </div>

        </article>
    );
}
