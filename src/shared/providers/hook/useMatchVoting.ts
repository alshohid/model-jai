"use client";

import { useAppSelector } from "@/redux/store";

export function useMatchVoting(matchId?: string) {
  const votingSession = useAppSelector((state) =>
    matchId ? state.matchVoting.sessions[matchId] ?? null : null,
  );

  return {
    votingSession,
    isHydrated: Boolean(votingSession?.isHydrated),
  };
}
