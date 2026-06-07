export type ChallengeMatchStatus = "open" | "accepted" | "official" | "delayed";
export type ChallengeMatchKind = "voting" | "supporting";

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
  amount: number;
  game: string;
  memo: string;
  durationHours: number;
  kind: ChallengeMatchKind;
  status: ChallengeMatchStatus;
  showRealName: boolean;
  createdAt: string;
};

export type ChallengeCreateFormValues = {
  gameId: string;
  launchAmount: string;
  targetPlayerId: string;
  targetAmount: string;
  showRealName: boolean;
  memo: string;
};
