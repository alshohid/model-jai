"use client";

import { PropsWithChildren, useEffect, useMemo } from "react";
import { useGetVotingPublicListQuery } from "@/redux/features/match/matchManagement";
import {
  upsertMatchVotingSession,
  clearMatchVotingSession,
} from "@/redux/features/match/matchVotingReducer";
import { useAppDispatch } from "@/redux/store";
import { attachRealtimeChannelDebug, logRealtimeLifecycle } from "@/shared/lib/realtimeDebug";
import { IMatch, ITopVoterItem } from "@/types/match/MatchManagementTypes";
import { getEcho } from "@/shared/lib/echo";

interface MatchVotingProviderProps extends PropsWithChildren {
  matchId?: string;
  matchData?: IMatch | null;
  leftPlayerImageSrc?: string;
  rightPlayerImageSrc?: string;
}

interface IVotingChannelPayload {
  matchData?: {
    match_id?: number | string;
    match_for_voting_id?: number | null;
    vote_start_time?: string | null;
    voting_time?: number | string | null;
    total_vote?: number | null;
    top_voters?: ITopVoterItem[];
    player_one?: {
      id?: number;
      name?: string | null;
      image?: string | null;
      total_votes?: number | null;
    };
    player_two?: {
      id?: number;
      name?: string | null;
      image?: string | null;
      total_votes?: number | null;
    };
  };
  data?: {
    match_id?: number | string;
    match_for_voting_id?: number | null;
    vote_start_time?: string | null;
    voting_time?: number | string | null;
    total_vote?: number | null;
    top_voters?: ITopVoterItem[];
    player_one?: {
      id?: number;
      name?: string | null;
      image?: string | null;
      total_votes?: number | null;
    };
    player_two?: {
      id?: number;
      name?: string | null;
      image?: string | null;
      total_votes?: number | null;
    };
  };
}

type VotingSideLike = {
  id?: number | string | null;
  image?: string | null;
  image_url?: string | null;
  total_votes?: number | string | null;
};

function hasSameId(
  leftId?: number | string | null,
  rightId?: number | string | null,
) {
  return leftId != null && rightId != null && String(leftId) === String(rightId);
}

function normalizeVotingSides<T extends VotingSideLike>(
  playerOne: T | undefined,
  playerTwo: T | undefined,
  currentPlayerOneId?: number | string | null,
  currentPlayerTwoId?: number | string | null,
) {
  const isSameOrder =
    hasSameId(playerOne?.id, currentPlayerOneId) &&
    hasSameId(playerTwo?.id, currentPlayerTwoId);
  const isReverseOrder =
    hasSameId(playerOne?.id, currentPlayerTwoId) &&
    hasSameId(playerTwo?.id, currentPlayerOneId);

  if (isReverseOrder) {
    return {
      playerOne: playerTwo,
      playerTwo: playerOne,
    };
  }

  if (isSameOrder) {
    return {
      playerOne,
      playerTwo,
    };
  }

  return {
    playerOne,
    playerTwo,
  };
}

function hasMatchingPlayerPair(
  playerOneId?: number | string | null,
  playerTwoId?: number | string | null,
  currentPlayerOneId?: number | string | null,
  currentPlayerTwoId?: number | string | null,
) {
  const isSameOrder =
    hasSameId(playerOneId, currentPlayerOneId) &&
    hasSameId(playerTwoId, currentPlayerTwoId);
  const isReverseOrder =
    hasSameId(playerOneId, currentPlayerTwoId) &&
    hasSameId(playerTwoId, currentPlayerOneId);

  return isSameOrder || isReverseOrder;
}

function extractVotingPayload(event: IVotingChannelPayload) {
  if (event?.matchData) return event.matchData;
  if (event?.data && "match_id" in event.data) return event.data;
  if ("match_id" in event || "player_one" in event || "top_voters" in event) {
    return event as NonNullable<IVotingChannelPayload["data"]>;
  }

  return null;
}

export default function MatchVotingProvider({
  children,
  matchId,
  matchData,
  leftPlayerImageSrc,
  rightPlayerImageSrc,
}: MatchVotingProviderProps) {
  const dispatch = useAppDispatch();
  const currentMatchId = matchId ? String(matchId) : "";
  const currentPlayerOneId =
    matchData?.player_one?.id ?? matchData?.player_one_id ?? null;
  const currentPlayerTwoId =
    matchData?.player_two?.id ?? matchData?.player_two_id ?? null;
  const initialTotalVotes =
    matchData?.player_one_votes != null || matchData?.player_two_votes != null
      ? Number(matchData?.player_one_votes ?? 0) +
        Number(matchData?.player_two_votes ?? 0)
      : undefined;

  const { data: votingData, refetch: refetchVotingList } =
    useGetVotingPublicListQuery(undefined, {
      skip: !currentMatchId,
      refetchOnMountOrArgChange: true,
    });

  const votingMatch = useMemo(() => {
    if (!matchData) return null;

    return (
      votingData?.data?.find((voteItem) => {
        const sameGame = matchData.game_id
          ? String(voteItem.game_id) === String(matchData.game_id)
          : true;
        const sameOrder =
          voteItem.player_one_id ===
          (matchData.player_one?.id ?? matchData.player_one_id) &&
          voteItem.player_two_id ===
          (matchData.player_two?.id ?? matchData.player_two_id);
        const reverseOrder =
          voteItem.player_one_id ===
          (matchData.player_two?.id ?? matchData.player_two_id) &&
          voteItem.player_two_id ===
          (matchData.player_one?.id ?? matchData.player_one_id);

        return sameGame && (sameOrder || reverseOrder);
      }) ?? null
    );
  }, [matchData, votingData?.data]);

  useEffect(() => {
    if (!currentMatchId || !matchData) return;

    dispatch(
      upsertMatchVotingSession({
        matchId: currentMatchId,
        gameId: matchData.game_id,
        playerOneId: currentPlayerOneId,
        playerTwoId: currentPlayerTwoId,
        voteStartTime: matchData.vote_start_time ?? null,
        votingTime: matchData.voting_time ?? null,
        topVoters: matchData.top_voters ?? [],
        totalVotes: initialTotalVotes,
        playerOneVotes:
          matchData.player_one_votes != null
            ? Number(matchData.player_one_votes)
            : undefined,
        playerTwoVotes:
          matchData.player_two_votes != null
            ? Number(matchData.player_two_votes)
            : undefined,
        playerOneImage:
          matchData.player_one_logo ||
          matchData.player_one?.image_url ||
          matchData.player_one?.image ||
          leftPlayerImageSrc ||
          null,
        playerTwoImage:
          matchData.player_two_logo ||
          matchData.player_two?.image_url ||
          matchData.player_two?.image ||
          rightPlayerImageSrc ||
          null,
      }),
    );
  }, [
    currentMatchId,
    currentPlayerOneId,
    currentPlayerTwoId,
    dispatch,
    initialTotalVotes,
    leftPlayerImageSrc,
    matchData,
    rightPlayerImageSrc,
  ]);

  useEffect(() => {
    if (!currentMatchId || !votingMatch) return;
    const normalizedVotingPlayers = normalizeVotingSides(
      votingMatch.player_one
        ? {
            id: votingMatch.player_one_id,
            image: votingMatch.player_one.image_url || votingMatch.player_one.image || null,
          }
        : undefined,
      votingMatch.player_two
        ? {
            id: votingMatch.player_two_id,
            image: votingMatch.player_two.image_url || votingMatch.player_two.image || null,
          }
        : undefined,
      currentPlayerOneId,
      currentPlayerTwoId,
    );

    dispatch(
      upsertMatchVotingSession({
        matchId: currentMatchId,
        matchForVotingId: votingMatch.id,
        gameId: votingMatch.game_id,
        playerOneId: currentPlayerOneId ?? votingMatch.player_one_id,
        playerTwoId: currentPlayerTwoId ?? votingMatch.player_two_id,
        playerOneImage: normalizedVotingPlayers.playerOne?.image ?? undefined,
        playerTwoImage: normalizedVotingPlayers.playerTwo?.image ?? undefined,
      }),
    );
  }, [
    currentMatchId,
    currentPlayerOneId,
    currentPlayerTwoId,
    dispatch,
    votingMatch,
  ]);

  useEffect(() => {
    if (!currentMatchId) return;

    const channelName = `match.${currentMatchId}`;
    const echo = getEcho();
    if (!echo) {
      logRealtimeLifecycle(
        "MatchVotingProvider",
        "Echo client unavailable; skipping channel subscription",
        { channelName, matchId: currentMatchId },
      );

      return () => {
        dispatch(clearMatchVotingSession(currentMatchId));
      };
    }

    const channel = echo.channel(channelName);
    const detachRealtimeDebug = attachRealtimeChannelDebug(channel, {
      channelName,
      channelType: "public",
      scope: "MatchVotingProvider",
    });

    const syncVotingSession = (
      eventName: string,
      event: IVotingChannelPayload,
    ) => {
      const payload = extractVotingPayload(event);
      if (!payload) return;
      const payloadPlayerOneId = payload.player_one?.id ?? null;
      const payloadPlayerTwoId = payload.player_two?.id ?? null;
      const hasPayloadPlayerPair =
        payloadPlayerOneId != null && payloadPlayerTwoId != null;
      const matchesCurrentPlayers = hasMatchingPlayerPair(
        payloadPlayerOneId,
        payloadPlayerTwoId,
        currentPlayerOneId,
        currentPlayerTwoId,
      );

      if (hasPayloadPlayerPair && !matchesCurrentPlayers) {
        logRealtimeLifecycle(
          "MatchVotingProvider",
          "Ignoring vote payload for a different player pair",
          {
            eventName,
            channelName,
            currentMatchId,
            payloadMatchId: payload.match_id ?? null,
            payloadPlayerOneId,
            payloadPlayerTwoId,
            currentPlayerOneId,
            currentPlayerTwoId,
          },
        );
        return;
      }

      const normalizedRealtimePlayers = normalizeVotingSides(
        payload.player_one,
        payload.player_two,
        currentPlayerOneId,
        currentPlayerTwoId,
      );

      dispatch(
        upsertMatchVotingSession({
          matchId: currentMatchId,
          matchForVotingId: payload.match_for_voting_id ?? undefined,
          voteStartTime: payload.vote_start_time ?? null,
          votingTime: payload.voting_time ?? null,
          totalVotes:
            normalizedRealtimePlayers.playerOne?.total_votes != null ||
            normalizedRealtimePlayers.playerTwo?.total_votes != null
              ? Number(normalizedRealtimePlayers.playerOne?.total_votes ?? 0) +
                Number(normalizedRealtimePlayers.playerTwo?.total_votes ?? 0)
              : payload.total_vote != null
                ? Number(payload.total_vote)
                : undefined,
          topVoters: payload.top_voters ?? undefined,
          playerOneId:
            currentPlayerOneId ?? normalizedRealtimePlayers.playerOne?.id ?? undefined,
          playerTwoId:
            currentPlayerTwoId ?? normalizedRealtimePlayers.playerTwo?.id ?? undefined,
          playerOneImage:
            normalizedRealtimePlayers.playerOne?.image ?? undefined,
          playerTwoImage:
            normalizedRealtimePlayers.playerTwo?.image ?? undefined,
          playerOneVotes:
            normalizedRealtimePlayers.playerOne?.total_votes != null
              ? Number(normalizedRealtimePlayers.playerOne.total_votes)
              : undefined,
          playerTwoVotes:
            normalizedRealtimePlayers.playerTwo?.total_votes != null
              ? Number(normalizedRealtimePlayers.playerTwo.total_votes)
              : undefined,
        }),
      );

      void refetchVotingList();
    };

    channel.listen(".voting.started", (event: IVotingChannelPayload) =>
      syncVotingSession(".voting.started", event),
    );
    channel.listen(".vote.placed", (event: IVotingChannelPayload) =>
      syncVotingSession(".vote.placed", event),
    );
    channel.listen(".voting.updated", (event: IVotingChannelPayload) =>
      syncVotingSession(".voting.updated", event),
    );
    channel.listen(".match.vote.updated", (event: IVotingChannelPayload) =>
      syncVotingSession(".match.vote.updated", event),
    );

    return () => {
      detachRealtimeDebug();
      logRealtimeLifecycle("MatchVotingProvider", "Leaving channel", {
        channelName,
        channelType: "public",
      });
      echo.leave(channelName);
      dispatch(clearMatchVotingSession(currentMatchId));
    };
  }, [
    currentMatchId,
    currentPlayerOneId,
    currentPlayerTwoId,
    dispatch,
    refetchVotingList,
  ]);

  return children;
}
