/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo } from "react";
import { useGetBigBossSupporterRankingAllDataQuery } from "@/redux/features/support/supportManagement";
import Skeleton from "@/shared/UI/Skeleton";
import SupporterCard from "@/shared/components/card/SupporterCard";
import RankPointReusableTable from "@/shared/components/rankPointTable/RankPointReusableTable";
import {
    FALLBACK_SUPPORTER_IMAGE,
    FALLBACK_SUPPORTER_NAME,
    normalizeSupporterRankingRows,
    SupporterRankingInput,
    SupporterRankingRow,
} from "@/shared/lib/ranking/supporterRanking";
import Image from "next/image";
import { calculateTotalSupportedAmount } from "@/shared/lib/utils/calculateTotalSupportedAmount";

export type Props = {
    data?: SupporterRankingInput[] | null;
    rows?: SupporterRankingRow[] | null;
    isLoading?: boolean;
};

const RankingSection = ({
    data: propData,
    rows: propRows,
    isLoading: propLoading,
}: Props) => {
    const shouldUseApi = !propData && !propRows;

    const { data: apiData, isLoading: apiLoading } =
        useGetBigBossSupporterRankingAllDataQuery(undefined, {
            skip: !shouldUseApi,
        });

    const rawData = propData ?? apiData?.data ?? [];
    const finalLoading = propLoading ?? apiLoading;
    const rankingRows = useMemo(
        () => propRows ?? normalizeSupporterRankingRows(rawData),
        [propRows, rawData]
    );
    const topSupporter = rankingRows[0];
    const totalSupportedAmount = calculateTotalSupportedAmount(topSupporter?.supportedAmounts || "");

    return (
        <section className="relative w-full ">
            {/* Background layer (clipped) */}
            <div className="pointer-events-none absolute inset-0 -z-10 ">
                <div className="absolute top-0 left-0 -translate-y-2/3 pointer-events-none">
                    <Image
                        src="/images/home/Ellipse2.png"
                        alt="ellipse"
                        width={1600}
                        height={800}
                        className="w-[1600px] h-[800px]"
                        unoptimized
                    />
                </div>

                <div className="absolute right-0 bottom-0 translate-y-1/4 pointer-events-none">
                    <Image
                        src="/images/home/Ellipse4.png"
                        width={1700}
                        height={1400}
                        alt="ellipse"
                        className="w-[1700px] h-[1400px]"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="container py-20">
                <div className="flex flex-col items-center gap-8">
                    {finalLoading ? (
                        <div className="w-full">
                            <Skeleton className="w-full h-40" />
                        </div>
                    ) : (
                        <SupporterCard
                            imageSrc={
                                topSupporter?.supporterImage ||
                                FALLBACK_SUPPORTER_IMAGE
                            }
                            profileHref={
                                topSupporter?.userId
                                    ? `/artist/${topSupporter.userId}`
                                    : undefined
                            }
                            title="Big Boss Supporter"
                            name={
                                topSupporter?.supporterName ||
                                FALLBACK_SUPPORTER_NAME
                            }
                            totalSupportedAmount={totalSupportedAmount}
                            className="mx-auto"
                        />
                    )}

                    <div className="w-full">
                        <RankPointReusableTable
                            rows={rankingRows}
                            isLoading={finalLoading}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RankingSection;
