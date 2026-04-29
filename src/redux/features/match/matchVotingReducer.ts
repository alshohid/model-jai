"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITopVoterItem } from "@/types/match/MatchManagementTypes";

export interface IMatchVotingSession {
  matchId: string;
  matchForVotingId?: number | null;
  gameId?: number | string | null;
  playerOneId?: number | null;
  playerTwoId?: number | null;
  voteStartTime?: string | null;
  votingTime?: number | string | null;
  playerOneImage?: string | null;
  playerTwoImage?: string | null;
  playerOneVotes?: number;
  playerTwoVotes?: number;
  totalVotes?: number;
  topVoters?: ITopVoterItem[];
  isHydrated: boolean;
}

interface IMatchVotingState {
  sessions: Record<string, IMatchVotingSession>;
}

type UpsertMatchVotingPayload = Partial<
  Omit<IMatchVotingSession, "matchId" | "isHydrated">
> & {
  matchId: string;
};

interface IApplyLocalVotePayload {
  matchId: string;
  playerId: number;
  voteCount: number;
}

const initialState: IMatchVotingState = {
  sessions: {},
};

const matchVotingSlice = createSlice({
  name: "matchVoting",
  initialState,
  reducers: {
    upsertMatchVotingSession: (
      state,
      action: PayloadAction<UpsertMatchVotingPayload>,
    ) => {
      const { matchId, ...rest } = action.payload;
      const existing = state.sessions[matchId] ?? {
        matchId,
        isHydrated: false,
      };

      const nextSession: IMatchVotingSession = {
        ...existing,
        matchId,
        isHydrated: true,
      };
      const sessionRecord = nextSession as unknown as Record<string, unknown>;

      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined) {
          if (
            key === "totalVotes" ||
            key === "playerOneVotes" ||
            key === "playerTwoVotes"
          ) {
            const prevValue = Number(sessionRecord[key] ?? 0);
            sessionRecord[key] = Math.max(
              prevValue,
              Number(value),
            );
            return;
          }

          sessionRecord[key] = value;
        }
      });

      state.sessions[matchId] = nextSession;
    },
    applyLocalVote: (state, action: PayloadAction<IApplyLocalVotePayload>) => {
      const { matchId, playerId, voteCount } = action.payload;
      const session = state.sessions[matchId];

      if (!session || voteCount <= 0) return;

      session.totalVotes = Number(session.totalVotes ?? 0) + voteCount;

      if (session.playerOneId === playerId) {
        session.playerOneVotes = Number(session.playerOneVotes ?? 0) + voteCount;
      } else if (session.playerTwoId === playerId) {
        session.playerTwoVotes = Number(session.playerTwoVotes ?? 0) + voteCount;
      }
    },
    clearMatchVotingSession: (state, action: PayloadAction<string>) => {
      delete state.sessions[action.payload];
    },
  },
});

export const {
  upsertMatchVotingSession,
  applyLocalVote,
  clearMatchVotingSession,
} = matchVotingSlice.actions;

export default matchVotingSlice.reducer;
