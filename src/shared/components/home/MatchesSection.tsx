"use client";

import { useMemo, useState } from "react";
import SectionHeading from "./SectionHeading";
import MatchHistoryTabs, { TabKey } from "./MatchHistoryTabs";
import MatchesGrid, { MatchItem } from "../grid/MatchesGrid";
import Image from "next/image";


const MOCK_MATCHES: MatchItem[] = [
    {
        id: "1",
        status: "Upcoming",
        title: "ShadowR vs Phoenix Force",
        dateText: "November 1, 2024",
        timeText: "4:30 pm",
        gameLogoSrc: "/images/home/gameLogoSrc.png",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
        watchHref: "/matches/1",
        voteRequired: true,
        versusImg: "/images/home/versus.png",
    },
    {
        id: "2",
        status: "Past",
        title: "ShadowR vs Phoenix Force",
        dateText: "November 1, 2024",
        timeText: "4:30 pm",
        gameLogoSrc: "/images/home/gameLogoSrc.png",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
        watchHref: "/matches/2",
        voteRequired: true,
        versusImg: "/images/home/versus.png",
    },
    {
        id: "3",
        status: "Upcoming",
        title: "ShadowR vs Phoenix Force",
        dateText: "November 1, 2024",
        timeText: "4:30 pm",
        gameLogoSrc: "/images/home/gameLogoSrc.png",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
        watchHref: "/matches/3",
        voteRequired: true,
        versusImg: "/images/home/versus.png",
    },
    {
        id: "4",
        status: "Upcoming",
        title: "ShadowR vs Phoenix Force",
        dateText: "November 1, 2024",
        timeText: "4:30 pm",
        gameLogoSrc: "/images/home/gameLogoSrc.png",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
        watchHref: "/matches/1",
        voteRequired: true,
        versusImg: "/images/home/versus.png",
    },
    {
        id: "5",
        status: "Upcoming",
        title: "ShadowR vs Phoenix Force",
        dateText: "November 1, 2024",
        timeText: "4:30 pm",
        gameLogoSrc: "/images/home/gameLogoSrc.png",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
        watchHref: "/matches/2",
        voteRequired: true,
        versusImg: "/images/home/versus.png",
    },
    {
        id: "6",
        status: "Upcoming",
        title: "ShadowR vs Phoenix Force",
        dateText: "November 1, 2024",
        timeText: "4:30 pm",
        gameLogoSrc: "/images/home/gameLogoSrc.png",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
        watchHref: "/matches/3",
        voteRequired: true,
        versusImg: "/images/home/versus.png",
    },
];

export default function MatchesSection({
    matches = MOCK_MATCHES, 
}: {
    matches?: MatchItem[];
}) {
    const [tab, setTab] = useState<TabKey>("all");

    const filtered = useMemo(() => {
        if (tab === "all") return matches;
        if (tab === "past") return matches.filter((m) => m.status === "Past");
        return matches.filter((m) => m.status === "Upcoming");
    }, [matches, tab]);

    return (
        <section className=" relative   pt-5 md:pt-17.5">
            <div className="pointer-events-none absolute left-0 top-0 -z-10">
                <Image
                    src="/images/home/top_left.png"
                    width={702}
                    height={702}
                    alt="elips"
                    className="w-[1200px] h-[1200px]"
                />
            </div>

            <div className=" relative z-10 max-w-7xl w-full mx-auto px-4 lg:px-0">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <SectionHeading title={"Compete in epic\ntournaments"} className="whitespace-pre-line" />
                    <MatchHistoryTabs value={tab} onChange={setTab} />
                </div>

                <div className="mt-10">
                    <MatchesGrid matches={filtered} />
                </div>
            </div>

            <div className=" pointer-events-none absolute right-0 bottom-0 -z-10 translate-y-1/2">
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
}

