import { MatchMode, TeamInfo } from "@/shared/components/watchLive/types";

export interface MatchPointsSummarySectionProps {
    layout: MatchMode;
    isLive: boolean;
    supportOpen?: boolean;
    left: TeamInfo;
    right: TeamInfo;
    matchId?: string;
    className?: string;
    tipEnabled?: boolean;
    onSupportLeft?: (amount: number, supporterName?: string) => void;
    onSupportRight?: (amount: number, supporterName?: string) => void;
}