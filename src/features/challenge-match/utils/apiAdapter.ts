import type { ChallengeMatchOffer, ChallengePlayer } from "../types";

/**
 * Raw shape returned by the GET /challenges endpoint.
 * The server returns snake_case keys; this type models the actual JSON.
 */
export interface ApiChallengeItem {
  id: number;
  challenge_no: string;
  rank: number;
  mode: "unique" | "global";
  status: string;
  amount: string;
  matched_points: string;
  logo: string | null;
  memo: string;
  show_real_name: boolean;
  duration_hours: number;
  duration_label: string;
  match_date: string;
  match_time: string;
  offer_expires_at: string;
  game: {
    id: number;
    name: string;
    image: string;
  };
  challenger: {
    id: number;
    name: string;
    image: string;
  };
  target_player: {
    id: number;
    name: string;
    image: string;
  } | null;
  acceptor: null;
  winner_id: null;
  created_at: string;
}

/**
 * Build a ChallengePlayer from the API's player info shape.
 * Falls back to anonymous data when the info is null.
 */
function toChallengePlayer(
  player: { id: number; name: string; image: string } | null | undefined,
  fallbackName = "Anyone",
  fallbackAvatar = "/images/home/avatar_img.png",
): ChallengePlayer {
  if (!player) {
    return {
      id: 0,
      name: fallbackName,
      handle: "@Anyone",
      avatar: fallbackAvatar,
    };
  }

  const rawHandle = player.name.replace(/\s+/g, "_");
  return {
    id: player.id,
    name: player.name,
    handle: `@${rawHandle}`,
    avatar: player.image || fallbackAvatar,
  };
}

/**
 * Map a single API challenge item into the UI's ChallengeMatchOffer shape.
 */
export function mapApiChallengeToOffer(
  item: ApiChallengeItem,
): ChallengeMatchOffer & {
  mode: "unique" | "global";
  targetPlayerId: number | null;
} {
  const challenger = toChallengePlayer(item.challenger);
  const target = toChallengePlayer(item.target_player, "Open Challenge");

  // Derive a stable string id
  const id = String(item.id);

  // Map server status to the union expected by the card
  const statusMap: Record<
    string,
    "open" | "accepted" | "official" | "delayed"
  > = {
    offered: "open",
    pending: "open",
    accepted: "accepted",
    official: "official",
    delayed: "delayed",
  };

  // There is no "kind" in the API; default based on mode
  const kind = item.mode === "unique" ? "supporting" : "voting";

  return {
    id,
    rank: item.rank,
    challenger,
    target,
    amount: Number(item.amount),
    game: item.game.name,
    memo: item.memo,
    durationHours: item.duration_hours,
    kind: kind as "voting" | "supporting",
    status: statusMap[item.status] ?? "open",
    showRealName: item.show_real_name,
    createdAt: item.created_at,
    // extra fields for accept-button logic
    mode: item.mode,
    targetPlayerId: item.target_player?.id ?? null,
  };
}
