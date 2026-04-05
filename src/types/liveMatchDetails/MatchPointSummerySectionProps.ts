import { IMatch } from "@/types/match/MatchManagementTypes";
import { TeamInfo } from "@/shared/components/watchLive/types";

export interface MatchPointsSummarySectionProps {
  isLive: boolean;
  matchType?: "upcoming" | "live" | "completed";
  gameId?: number | string;
  left: TeamInfo;
  right: TeamInfo;
  matchId?: string;
  className?: string;
  tipEnabled?: boolean;
  leftBoss?: string;
  rightBoss?: string;
  playerId?: number;
  userReferralNo?: string;
  leftPlayerImageSrc?: string;
  rightPlayerImageSrc?: string;
  matchData?: IMatch | null;
  onSupportLeft?: (amount: number, supporterName?: string) => void;
  onSupportRight?: (amount: number, supporterName?: string) => void;
}
