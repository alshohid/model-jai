import type { ChallengeMatchOffer, ChallengePlayer } from "../types";

export interface ApiChallengeItem {
  id: number;
  challenge_no: string;
  rank: number | null;
  mode: "unique" | "global";
  status: string;
  amount: string;
  matched_points?: string;
  logo: string | null;
  memo: string;
  show_real_name: boolean;
  duration_hours: number;
  duration_label?: string;
  match_date: string;
  match_time: string;
  challenger_ready_at?: string | null;
  acceptor_ready_at?: string | null;
  both_players_ready?: boolean;
  started_at?: string | null;
  submitted_for_review_at?: string | null;
  admin_reviewed_at?: string | null;
  offer_expires_at?: string | null;
  is_expired?: boolean;
  can_accept?: boolean;
  expiry_message?: string | null;
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
  acceptor: {
    id: number;
    name: string;
    image: string;
  } | null;
  winner_id: number | null;
  is_published?: boolean;
  published_match_id?: number | null;
  created_at: string;
}

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
  rawApiItem: ApiChallengeItem;
} {
  const challenger = toChallengePlayer(item.challenger);
  const target = toChallengePlayer(
    item.target_player || item.acceptor,
    "Open Challenge",
  );

  // Derive a stable string id
  const id = String(item.id);

  // Map server status to the union expected by the card
  const statusMap: Record<
    string,
    "open" | "accepted" | "completed" | "delayed"
  > = {
    offered: "open",
    pending: "open",
    accepted: "accepted",
    under_review: "accepted",
    completed: "completed",
    delayed: "delayed",
  };

  // There is no "kind" in the API; default based on mode
  const kind = item.mode === "unique" ? "supporting" : "voting";

  return {
    id,
    rank: item.rank ?? 0,
    challenger,
    target,
    accepted: item?.acceptor || null,
    acceptedPlayer: item?.acceptor || null,
    isAccepted: true,
    amount: Number(item.amount),
    game: item.game?.name || "Game",
    memo: item.memo,
    durationHours: item.duration_hours,
    kind: kind as "voting" | "supporting",
    status: statusMap[item.status] ?? "open",
    showRealName: item.show_real_name,
    createdAt: item.created_at,
    match_date: item.match_date,
    match_time: item.match_time,
    // extra fields for accept-button logic
    mode: item.mode,
    targetPlayerId: item.target_player?.id ?? null,
    rawApiItem: item,
  };
}

