/* eslint-disable @typescript-eslint/no-explicit-any */
export type ChallengeMatchStatus = "open" | "accepted" | "official" | "delayed";
export type ChallengeMatchKind = "voting" | "supporting";
export type ChallengeCreateScope = "unique" | "global";

export type ChallengePlayer = {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  game?: string;
};

export type ChallengeMatchOffer = {
  id: string;
  rank: number;
  challenger: ChallengePlayer;
  target: ChallengePlayer;
  accepted: any;
  acceptedPlayer: any;
  isAccepted: boolean;
  amount: number;
  game: string;
  memo: string;
  durationHours: number;
  kind: ChallengeMatchKind;
  status: any;
  showRealName: boolean;
  createdAt: string;
  /** "unique" or "global" — from the API */
  mode?: "unique" | "global";
  /** The target_player's id for "unique" mode challenges (null for "global") */
  targetPlayerId?: number | null;
  match_date: string;
  match_time: string;
};

export type ChallengeCreateFormValues = {
  gameId: string;
  price: string;
  matchDateTime: string;
  scope: ChallengeCreateScope;
  targetPlayerId: string;
  showRealName: boolean;
  memo: string;
};
