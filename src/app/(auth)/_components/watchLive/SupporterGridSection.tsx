"use client";

import SupporterGridContainer from "./SupporterGridContainer";
import LiveSectionHeader from "./LiveSectionHeader";

export default function SupporterGridSection({ matchId }: { matchId: string }) {
    return (
        <div className="py-10">
            <LiveSectionHeader
                title="Supporter Grid"
                className="mb-8 md:mb-10 tracking-wide text-[48px]"
            />
            <SupporterGridContainer matchId={matchId} matchStatus="Live" locked={false} />
        </div>
    );
}
