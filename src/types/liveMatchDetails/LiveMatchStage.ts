import { Side } from "@/shared/hooks/useMatchDemoStore";

export interface StageProps {
  matchId: string;
  twitchChannel: string;
  isLive: boolean;
  tipEnabled?: boolean;
  rules: string | null;
  onRulesClick: () => void;
  playerTwoLogo?: string;
  playerOneLogo?: string;

  mode?: "landscape" | "portrait";
  supportClosed: boolean;

  left: { name: string; points: number; imageSrc: string };
  right: { name: string; points: number; imageSrc: string };
  middle: { label: string; imageSrc: string };
  bossSide: Side | null;

  onSupportLeft?: (amount: number, supporterName?: string) => void;
  onSupportRight?: (amount: number, supporterName?: string) => void;
}
