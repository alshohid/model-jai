import { memo } from "react";
import { Divider } from "./Divider";
import { ScoreItem } from "./ScoreItem";
import { MatchScoreCardProps } from "./types";

export const MatchScoreCard = memo(function MatchScoreCard({
    title,
    left,
    right,
}: MatchScoreCardProps) {
    return (
        <div
            className="
        w-fit
        rounded-3xl
        border border-white/10
        bg-[#111317]
        px-5
        py-2
        shadow-xl
      "
        >
            <div className="md:mb-3 text-center">
                <p className="text-lg font-semibold text-white/90">
                    {title}
                </p>
            </div>

            <div className="flex items-center justify-center gap-3 md:gap-5">
                <ScoreItem
                    score={left.score}
                    color={left.color}
                />

                <Divider />

                <ScoreItem
                    score={right.score}
                    color={right.color}
                />
            </div>
        </div>
    );
});