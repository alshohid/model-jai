/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { useGetAllPublicMatchListQuery } from "@/redux/features/match/matchManagement";
import MatchHistoryTabs, { TabKey } from "./MatchHistoryTabs";
import MatchesGrid from "../grid/MatchesGrid";

import Image from "next/image";
import SectionHeading from "./SectionHeading";

const MatchesSection = () => {
    const [tab, setTab] = useState<TabKey>("all");
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading } = useGetAllPublicMatchListQuery({
        page,
        limit,
        type: tab === "all" ? undefined : tab,
    });

    const matches = data?.data || [];
    return (
        <section className="relative pt-2 md:pt-17.5">
            <div className="pointer-events-none absolute left-0 top-0 -z-10">
                <Image
                    src="/images/home/top_left.png"
                    width={702}
                    height={702}
                    alt="elips"
                    className="w-[1200px] h-[1200px]"
                />
            </div>

            <div className="relative z-10 container">
                <div className="flex flex-col gap-5 sm:text-center lg:flex-row lg:items-center lg:justify-between">
                    <SectionHeading
                        title={"Compete in epic\ntournaments"}
                        className="whitespace-pre-line sm:text-center lg:text-left"
                    />

                    <MatchHistoryTabs
                        className="lg:shrink-0"
                        value={tab}
                        onChange={setTab}
                    />
                </div>

                <div className="mt-10">
                    <MatchesGrid matches={matches} isLoading={isLoading} />
                </div>
            </div>

            <div className="pointer-events-none absolute right-0 bottom-0 -z-10 translate-y-1/2">
                <Image
                    src="/images/home/bottom_right.png"
                    width={702}
                    height={702}
                    alt="elips"
                    className="w-[1700px] h-[1400px]"
                />
            </div>
        </section>
    );
};

export default MatchesSection;