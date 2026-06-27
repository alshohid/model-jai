import type { IAppNotificationItem } from "@/types/notifications/NotitficationsTypes";

/**
 * Determines the target route path for a given notification item.
 * This function maps each notification category to its corresponding
 * application route so users are redirected to the correct page on click.
 *
 * Route mapping:
 * - match.created       → /live-stream/match/:match_id  or  /artist/:playerId
 * - match.completed     → /live-stream/match/:match_id
 * - admin.withdrawal.created → /admin/dashboard/withdrawals
 * - user.withdrawal.*   → /transactions
 * - coin.received       → /user-profile  or  /artist/:sender_id
 * - challenge.won/lost  → /live-stream/match/:match_id  or  /challenge-match
 */
export function getNotificationRoute(
  notification: IAppNotificationItem,
): string | null {
  const raw = notification.raw as Record<string, unknown> | undefined;

  switch (notification.category) {
    // ── Match Created → redirect to the match live-stream page ──
    case "match.created": {
      const matchId = raw?.match_id;
      if (matchId) {
        return `/live-stream/match/${matchId}`;
      }
      // If player IDs are present, redirect to a specific player's page
      const playerIds = raw?.player_ids as number[] | undefined;
      if (playerIds && playerIds.length > 0) {
        return `/artist/${playerIds[0]}`;
      }
      return null;
    }

    // ── Match Completed → redirect to the match live-stream page ──
    case "match.completed": {
      const matchId = raw?.match_id;
      if (matchId) {
        return `/live-stream/match/${matchId}`;
      }
      return null;
    }

    // ── Admin: new withdrawal request → redirect to admin withdrawal management ──
    case "admin.withdrawal.created": {
      const withdrawId = raw?.withdraw_id;
      if (withdrawId) {
        return `/admin/dashboard/withdrawals?id=${withdrawId}`;
      }
      return "/admin/dashboard/withdrawals";
    }

    // ── User: withdrawal completed → redirect to transactions page ──
    case "user.withdrawal.completed": {
      return "/transactions";
    }

    // ── User: withdrawal declined → redirect to transactions page ──
    case "user.withdrawal.declined": {
      return "/transactions";
    }

    // ── Coin received → redirect to sender's artist page or user profile ──
    case "coin.received": {
      const senderId = raw?.sender_id;
      if (senderId) {
        return `/artist/${senderId}`;
      }
      return "/user-profile";
    }

    // ── Challenge won/lost → redirect to challenge match page ──
    case "challenge.won":
    case "challenge.lost": {
      const challengeMatchId = raw?.match_id;
      if (challengeMatchId) {
        return `/live-stream/match/${challengeMatchId}`;
      }
      return "/challenge-match";
    }

    // ── Fallback for generic / unknown notification types ──
    default: {
      return null;
    }
  }
}
