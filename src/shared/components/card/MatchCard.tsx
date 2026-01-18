import WatchStreamButton from "@/shared/UI/button/WatchStreamButton";
import Image from "next/image";
import Link from "next/link";


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
                "w-full ",
                "rounded-[16px]",
                "bg-matchCardBg border border-matchCardBorder backdrop-blur-[16px]",
                // "p-5 sm:p-4",
                "flex flex-col",
                className,
            ].join(" ")}
        >
            <div className="w-full">
                <div className=" overflow-hidden px-3 py-2 md:p-6">
                    <div className="grid grid-cols-[1fr_12px_1fr] sm:grid-cols-[1fr_20px_1fr] md:grid-cols-[1fr_30px_1fr] aspect-[2.8/2] gap-1 rounded-[16px] bg-[#FFFFFF0D] border border-white/10">
                        {/* left player */}
                        <div className="relative overflow-hidden 
                    ">
                            <Image
                                src={leftPlayerImg}
                                alt="Player 1"
                                fill
                                className="object-cover"
                                sizes="(max-width: 300px) 28vw, 150px"
                            />
                        </div>

                        {/* vs */}
                        <div className="shrink-0 flex items-center justify-center">
                            <Image
                                src={versusImg}
                                alt="versus"
                                width={120}
                                height={120}
                                className="w-full h-auto "
                                unoptimized
                            />
                        </div>

                        <div className="relative overflow-hidden shrink-0">
                            <Image
                                src={rightPlayerImg}
                                alt="Player 2"
                                fill
                                className="object-cover "
                                sizes="(max-width: 640px) 28vw, 150px"
                            />
                        </div>
                    </div>
                    <div className="w-full ">
                        <div className="aspect-[18/6] relative">
                            <Image
                                src={gameLogoSrc}
                                alt="Game Logo"
                                fill
                                className="h-full w-full object-contain"
                            // sizes="(max-width: 640px) 80vw, 360px"
                            />
                        </div>

                        <div className="flex flex-col gap-2 md:gap-3">
                            <div className="flex items-center">
                                <span className={[" px-2 py-0 md:px-3 md:py-1 rounded-md text-xs", statusStyle].join(" ")}>
                                    {status}
                                </span>
                            </div>

                            <h3 className="text-white font-semibold text-[12px] md:text-[18px]  leading-tight">
                                {title}
                            </h3>
                            <div className="flex  items-center gap-x-1 md:gap-x-6 gap-y-2 text-white/75 text-xs md:text-sm">
                                <div className="flex items-center gap-2 ">
                                    <span className="text-cyan-300 text-[10px] md:text-[14px]">🗓</span>
                                    <span className="text-[9px] md:text-[14px]">{dateText}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-cyan-300 text-[10px] md:text-[14px]">🕒</span>
                                    <span className="text-[10px] md:text-[14px]">{timeText}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2 md:mt-5">
                            <WatchStreamButton
                                label="Watch stream"
                                onClick={onWatch}
                            />
                            {voteRequired ? (
                                <p className="text-center text-xs md:text-[1rem] mt-2 md:mt-3 font-medium text-[#FF2EC8]">
                                    Tiktok Vote Required
                                </p>) : (
                                <div className="flex items-center justify-center ">
                                    <Link href={'https://www.tiktok.com/'}>
                                        <Image src={'/images/home/tiktok_1.png'}
                                            width={400}
                                            height={400}
                                            alt="tiktok"
                                            className="w-8 h-8 md:w-12 md:h-12"
                                        />
                                    </Link>
                                    <Link href={'https://www.twitch.tv/'}>
                                        <Image src={'/images/home/twitch.png'}
                                            width={400}
                                            height={400}
                                            alt="tiktok"
                                            className="w-6 h-6 md:w-8 md:h-8"

                                        />

                                    </Link>

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
