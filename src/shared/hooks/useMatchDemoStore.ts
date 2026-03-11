/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getEcho } from "@/shared/lib/echo";
import { usePlaceSupportMutation } from "@/redux/features/support/supportManagement";
import { IMatch } from "@/types/match/MatchManagementTypes";
import {
  ISupportPlacedData,
  ISupportPlacedEvent,
  ITopSupporterItem,
} from "@/types/support/liveSupportTypes";

export type Side = "left" | "right";

type BossSummary = {
  name: string;
  total: number;
  imageSrc?: string;
};

const FALLBACK_LEFT = "/images/home/panel_left.png";
const FALLBACK_RIGHT = "/images/home/panel_right.png";
const FALLBACK_MIDDLE = "/images/home/middle.png";
const FALLBACK_LEFT_TEAM = "/images/home/bayern.png";
const FALLBACK_RIGHT_TEAM = "/images/home/totenhum.png";

function toNumber(value: string | number | null | undefined) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function parseSupportedAmounts(value?: string) {
  if (!value) return 0;
  return value
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isFinite(v))
    .reduce((sum, v) => sum + v, 0);
}

function topFromList(list: ITopSupporterItem[]): BossSummary {
  if (!list.length) {
    return {
      name: "No Supporter",
      total: 0,
      imageSrc: "/images/home/avatar_img.png",
    };
  }

  const top = list[0];

  return {
    name: top.supporter?.name || "No Supporter",
    total: parseSupportedAmounts(top.supported_amounts),
    imageSrc: top.supporter?.image || "/images/home/avatar_img.png",
  };
}

export function useMatchDemoStore(matchId: string, match?: IMatch | null) {
  const [placeSupport, { isLoading: isSupporting }] = usePlaceSupportMutation();

  const [viewerBalance, setViewerBalance] = useState<number>(0);

  const [leftSupporters, setLeftSupporters] = useState<ITopSupporterItem[]>([]);
  const [rightSupporters, setRightSupporters] = useState<ITopSupporterItem[]>(
    [],
  );

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
  }, [match]);

  const applySupportData = useCallback(
    (payload: ISupportPlacedData) => {
      setLeft((prev) => ({
        ...prev,
        points: toNumber(payload.match_player_one_total),
      }));

      setRight((prev) => ({
        ...prev,
        points: toNumber(payload.match_player_two_total),
      }));

      const supportedPlayerId = Number(payload.support.supported_player_id);

      if (supportedPlayerId === left.id) {
        setLeftSupporters(payload.top_supporters || []);
      }

      if (supportedPlayerId === right.id) {
        setRightSupporters(payload.top_supporters || []);
      }

      setViewerBalance(toNumber(payload.updated_balance));
    },
    [left.id, right.id],
  );

  useEffect(() => {
    const echo = getEcho();
    if (!echo || !matchId) return;

    const channelName = `match.${matchId}`;

    echo
      .channel(channelName)
      .listen(".support.placed", (event: ISupportPlacedEvent) => {
        applySupportData(event.data);
      });

    return () => {
      echo.leave(channelName);
    };
  }, [matchId, applySupportData]);

  const bossSide = useMemo(() => {
    if (left.points === right.points) return null;
    return left.points > right.points ? ("left" as const) : ("right" as const);
  }, [left.points, right.points]);

  const topLeft = useMemo(() => topFromList(leftSupporters), [leftSupporters]);
  const topRight = useMemo(
    () => topFromList(rightSupporters),
    [rightSupporters],
  );

  const support = useCallback(
    async (side: Side, amount: number, supporterName?: string) => {
      const supportedPlayerId = side === "left" ? left.id : right.id;

      if (!matchId || !supportedPlayerId || amount <= 0) return;

      const response = await placeSupport({
        match_id: Number(matchId),
        supported_player_id: supportedPlayerId,
        coin_amount: amount,
      }).unwrap();

      // NOTE:
      // supporterName backend নেয় না; backend auth user থেকেই supporter identify করে
      void supporterName;

      applySupportData(response.data);
    },
    [applySupportData, left.id, matchId, placeSupport, right.id],
  );

  return {
    matchId,
    left,
    right,
    middle,
    bossSide,
    topLeft,
    topRight,
    leftSupporters,
    rightSupporters,
    viewerBalance,
    isSupporting,
    support,
  };
}
