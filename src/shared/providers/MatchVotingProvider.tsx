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
        playerOneId: matchData.player_one?.id ?? matchData.player_one_id ?? null,
        playerTwoId: matchData.player_two?.id ?? matchData.player_two_id ?? null,
        voteStartTime: matchData.vote_start_time ?? null,
        votingTime: matchData.voting_time ?? null,
        topVoters: matchData.top_voters ?? [],
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
    dispatch,
    leftPlayerImageSrc,
    matchData,
    rightPlayerImageSrc,
  ]);

  useEffect(() => {
    if (!currentMatchId || !votingMatch) return;

    dispatch(
      upsertMatchVotingSession({
        matchId: currentMatchId,
        matchForVotingId: votingMatch.id,
        gameId: votingMatch.game_id,
        playerOneId: votingMatch.player_one_id,
        playerTwoId: votingMatch.player_two_id,
        totalVotes: votingMatch.total_vote ?? 0,
        playerOneImage:
          votingMatch.player_one?.image_url || votingMatch.player_one?.image || undefined,
        playerTwoImage:
          votingMatch.player_two?.image_url || votingMatch.player_two?.image || undefined,
      }),
    );
  }, [currentMatchId, dispatch, votingMatch]);

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

    const syncVotingSession = (event: IVotingChannelPayload) => {
      const payload = extractVotingPayload(event);
      if (!payload) return;

      dispatch(
        upsertMatchVotingSession({
          matchId: currentMatchId,
          matchForVotingId: payload.match_for_voting_id ?? undefined,
          voteStartTime: payload.vote_start_time ?? null,
          votingTime: payload.voting_time ?? null,
          totalVotes:
            payload.total_vote != null
              ? Number(payload.total_vote)
              : Number(payload.player_one?.total_votes ?? 0) +
                Number(payload.player_two?.total_votes ?? 0),
          topVoters: payload.top_voters ?? undefined,
          playerOneId: payload.player_one?.id ?? undefined,
          playerTwoId: payload.player_two?.id ?? undefined,
          playerOneImage: payload.player_one?.image ?? undefined,
          playerTwoImage: payload.player_two?.image ?? undefined,
          playerOneVotes:
            payload.player_one?.total_votes != null
              ? Number(payload.player_one.total_votes)
              : undefined,
          playerTwoVotes:
            payload.player_two?.total_votes != null
              ? Number(payload.player_two.total_votes)
              : undefined,
        }),
      );

      void refetchVotingList();
    };

    channel.listen(".voting.started", syncVotingSession);
    channel.listen(".vote.placed", syncVotingSession);
    channel.listen(".voting.updated", syncVotingSession);
    channel.listen(".match.vote.updated", syncVotingSession);

    return () => {
      detachRealtimeDebug();
      logRealtimeLifecycle("MatchVotingProvider", "Leaving channel", {
        channelName,
        channelType: "public",
      });
      echo.leave(channelName);
      dispatch(clearMatchVotingSession(currentMatchId));
    };
  }, [currentMatchId, dispatch, refetchVotingList]);

  return children;
}
