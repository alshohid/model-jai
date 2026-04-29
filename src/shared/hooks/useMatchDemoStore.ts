/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getEcho } from "@/shared/lib/echo";
import {
  attachRealtimeChannelDebug,
  logRealtimeLifecycle,
} from "@/shared/lib/realtimeDebug";
import { usePlaceSupportMutation } from "@/redux/features/support/supportManagement";
import {
  IMatch,
  ITopSupporterItem,
  ITopSupporterUser,
} from "@/types/match/MatchManagementTypes";
import {
  ISupportPlacedData,
  ISupportPlacedEvent,
} from "@/types/support/liveSupportTypes";
import { toast } from "sonner";

export type Side = "left" | "right";

type BossSummary = {
  name: string;
  imageSrc?: string;
};

const FALLBACK_LEFT = "/images/home/panel_left.png";
const FALLBACK_RIGHT = "/images/home/panel_right.png";
const FALLBACK_MIDDLE = "/images/home/middle.png";
const FALLBACK_LEFT_TEAM = "/images/home/bayern.png";
const FALLBACK_RIGHT_TEAM = "/images/home/totenhum.png";
const FALLBACK_AVATAR = "/images/home/avatar_img.png";

function toNumber(value: string | number | null | undefined) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function bossFromUser(user?: ITopSupporterUser | null): BossSummary {
  return {
    name: user?.name || "No Supporter",
    imageSrc: user?.image || FALLBACK_AVATAR,
  };
}

export function useMatchDemoStore(matchId: string, match?: IMatch | null) {
  const [placeSupport, { isLoading: isSupporting }] = usePlaceSupportMutation();

  const [viewerBalance, setViewerBalance] = useState<number>(0);
  const [rankingSupporters, setRankingSupporters] = useState<
    ITopSupporterItem[]
  >([]);

  const [leftBoss, setLeftBoss] = useState<BossSummary>({
    name: "No Supporter",
    imageSrc: FALLBACK_AVATAR,
  });

  const [rightBoss, setRightBoss] = useState<BossSummary>({
    name: "No Supporter",
    imageSrc: FALLBACK_AVATAR,
  });

  const [left, setLeft] = useState({
    id: 0,
    name: match?.player_one?.name ?? "JACK",
    points: 0,
    imageSrc: FALLBACK_LEFT,
    teamLogoSrc: FALLBACK_LEFT_TEAM,
  });

  const [right, setRight] = useState({
    id: 0,
    name: match?.player_two?.name ?? "STEEVE",
    points: 0,
    imageSrc: FALLBACK_RIGHT,
    teamLogoSrc: FALLBACK_RIGHT_TEAM,
  });

  const middle = useMemo(
    () => ({
      label: "Model",
      imageSrc: FALLBACK_MIDDLE,
    }),
    [],
  );

  useEffect(() => {
    if (!match) return;

    setLeft({
      id: match.player_one?.id || match.player_one_id || 0,
      name: match.player_one?.name || "Player One",
      points: toNumber(match.player_one_total),
      imageSrc:
        match.player_one?.image_url || match.player_one?.image || FALLBACK_LEFT,
      teamLogoSrc: match.game?.image || FALLBACK_LEFT_TEAM,
    });

    setRight({
      id: match.player_two?.id || match.player_two_id || 0,
      name: match.player_two?.name || "Player Two",
      points: toNumber(match.player_two_total),
      imageSrc:
        match.player_two?.image_url ||
        match.player_two?.image ||
        FALLBACK_RIGHT,
      teamLogoSrc: match.game?.image || FALLBACK_RIGHT_TEAM,
    });

    setRankingSupporters(match.top_supporters || []);
    setLeftBoss(bossFromUser(match.player_one_top_supporter));
    setRightBoss(bossFromUser(match.player_two_top_supporter));
  }, [match]);

  const applySupportData = useCallback((payload: ISupportPlacedData) => {
    setLeft((prev) => ({
      ...prev,
      points: toNumber(payload.match_player_one_total),
    }));

    setRight((prev) => ({
      ...prev,
      points: toNumber(payload.match_player_two_total),
    }));

    setRankingSupporters(payload.top_supporters || []);
    setLeftBoss(bossFromUser(payload.player_one_top_supporter));
    setRightBoss(bossFromUser(payload.player_two_top_supporter));

    setViewerBalance(toNumber(payload.updated_balance));
  }, []);

  useEffect(() => {
    const channelName = `match.${matchId}`;
    const echo = getEcho();
    if (!echo || !matchId) {
      if (matchId) {
        logRealtimeLifecycle(
          "useMatchDemoStore",
          "Echo client unavailable; skipping channel subscription",
          { channelName, matchId },
        );
      }

      return;
    }

    const channel = echo.channel(channelName);
    const detachRealtimeDebug = attachRealtimeChannelDebug(channel, {
      channelName,
      channelType: "public",
      scope: "useMatchDemoStore",
    });

    channel.listen(".support.placed", (event: ISupportPlacedEvent) => {
      applySupportData(event.data);
    });

    return () => {
      detachRealtimeDebug();
      logRealtimeLifecycle("useMatchDemoStore", "Leaving channel", {
        channelName,
        channelType: "public",
      });
      echo.leave(channelName);
    };
  }, [matchId, applySupportData]);

  const bossSide = useMemo(() => {
    if (left.points === right.points) return null;
    return left.points > right.points ? ("left" as const) : ("right" as const);
  }, [left.points, right.points]);

  const support = useCallback(
    async (side: Side, amount: number, supporterName?: string) => {
      const supportedPlayerId = side === "left" ? left.id : right.id;

      if (!matchId || !supportedPlayerId || amount <= 0) return;
      try {
        const response = await placeSupport({
          match_id: Number(matchId),
          supported_player_id: supportedPlayerId,
          coin_amount: amount,
        }).unwrap();

        void supporterName;
        applySupportData(response.data);
        toast.success("Support placed successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to place support");
      }
    },
    [applySupportData, left.id, matchId, placeSupport, right.id],
  );

  return {
    matchId,
    left,
    right,
    middle,
    bossSide,
    leftBoss,
    rightBoss,
    rankingSupporters,
    viewerBalance,
    isSupporting,
    support,
  };
}
