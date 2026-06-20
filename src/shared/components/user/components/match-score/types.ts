export interface TeamScore {
  score: number;
  color: "green" | "red";
}

export interface MatchScoreCardProps {
  title: string;
  left: TeamScore;
  right: TeamScore;
}
