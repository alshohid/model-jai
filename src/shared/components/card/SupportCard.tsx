import clsx from "clsx";
import { Meta } from "../cardComponent/Meta";
import { PlayerImage } from "../cardComponent/PlayerImage";
import { Versus } from "../cardComponent/Versus";

type SupportStatus = "live" | "unsettled" | "settled";

type Props = {
    status: SupportStatus;
    supporterName: string;
    playerName: string;
    amount: number;
    dateText: string;
    timeText: string;
    leftPlayerImg: string;
    rightPlayerImg: string;
    versusImg: string;
    className?: string;
};

export default function SupportCard({
    status,
    supporterName,
    playerName,
    amount,
    dateText,
    timeText,
    leftPlayerImg,
    rightPlayerImg,
    versusImg,
    className = "",
}: Props) {
    const statusStyle = clsx(
        "px-2 md:px-3 py-0 md:py-1 rounded-md text-xs border",
        status === "live"
            ? "bg-red-500/25 text-red-100 border-red-400/30"
            : status === "unsettled"
              ? "bg-yellow-500/25 text-yellow-100 border-yellow-400/30"
              : "bg-green-500/25 text-green-100 border-green-400/30"
    );

    const statusLabel =
        status === "live" ? "Live Now" : status === "unsettled" ? "Unsettled" : "Settled";

    return (
        <article
            className={clsx(
                "w-full flex flex-col rounded-[16px]",
                "bg-matchCardBg border border-matchCardBorder backdrop-blur-[16px]",
                className
            )}
        >
            <div className="overflow-hidden px-3 py-2 md:p-6">
                {/* PLAYER IMAGES */}
                <div className="grid grid-cols-[1fr_12px_1fr] sm:grid-cols-[1fr_20px_1fr] md:grid-cols-[1fr_30px_1fr]
            aspect-[2.8/2] gap-1 rounded-[16px] bg-[#FFFFFF0D] border border-white/10 p-2 md:p-5 mb-2">
                    <PlayerImage src={leftPlayerImg} />
                    <Versus src={versusImg} />
                    <PlayerImage src={rightPlayerImg} />
                </div>

                {/* INFO */}
                <div className="mt-2">
                    {/* STATUS */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className={statusStyle}>{statusLabel}</span>
                    </div>

                    {/* SUPPORTER NAME */}
                    <h3 className="text-white font-semibold text-[12px] md:text-[16px] leading-tight mb-1">
                        Support by <span className="font-bold">{supporterName}</span>
                    </h3>

                    {/* PLAYER NAME & AMOUNT */}
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                        <p className="text-white/75 text-xs md:text-sm">
                            Supporting <span className="font-semibold text-white">{playerName}</span>
                        </p>
                        <div className="flex items-center gap-1">
                            <span className="text-[#80f03f] font-bold text-sm md:text-base">
                                ₱{amount.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* META INFO */}
                    <div className="flex gap-x-1 md:gap-x-6 text-white/75 text-xs md:text-sm">
                        <Meta icon="🗓" text={dateText} />
                        <Meta icon="🕒" text={timeText} />
                    </div>
                </div>
            </div>
        </article>
    );
}
