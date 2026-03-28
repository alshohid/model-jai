"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { useAuth } from "@/redux/features/auth/hooks";
import LiveSectionHeader from "./LiveSectionHeader";
import { useGetVotingPublicListQuery, useGoVoteMutation } from "@/redux/features/match/matchManagement";
import VoteMatchCard from "@/shared/components/card/VoteMatchCard";

const LoadingSkeleton = () => (
  <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="h-[260px] rounded-[16px] border border-white/10 bg-white/5 animate-pulse md:h-[360px]"
      />
    ))}
  </div>
);

export default function GameBrowseSection() {
  const router = useRouter();
  const { isAuthenticated, role } = useAuth();
  const { data, isLoading } = useGetVotingPublicListQuery();
  const [goVote] = useGoVoteMutation();
  const [votingId, setVotingId] = useState<number | null>(null);

  const handleVote = async (matchForVotingId: number) => {
    if (!isAuthenticated || (role !== "user" && role !== "artist")) {
      router.push(`/login?redirect=${encodeURIComponent("/live-stream")}`);
      return;
    }

    try {
      setVotingId(matchForVotingId);
      const response = await goVote(matchForVotingId).unwrap();
      toast.success(response.message || "Vote submitted successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to submit vote"));
    } finally {
      setVotingId(null);
    }
  };

  return (
    <section className="relative w-full overflow-hidden py-12 sm:py-16 md:py-20">
      <div className="pointer-events-none absolute right-0 bottom-0 -z-10 translate-y-1/2">
        <Image
          src="/images/home/bottom_right.png"
          width={702}
          height={702}
          alt="section glow"
          className="h-[1400px] w-[1700px]"
        />
      </div>

      <div className="container px-4 sm:px-6">
        <LiveSectionHeader
          title="Vote For The Next Match"
          className="mb-8 text-[28px] tracking-wide sm:mb-12 sm:text-[36px] md:mb-16 md:text-[48px]"
        />

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
            {data?.data?.map((match) => (
              <VoteMatchCard
                key={match.id}
                title={match.game?.name || "Voting Match"}
                gameLogoSrc={match.game?.image || "/images/home/gameLogo.png"}
                leftPlayerImg={
                  match.player_one?.image_url || "/images/home/leftPlayerImg.png"
                }
                rightPlayerImg={
                  match.player_two?.image_url || "/images/home/rightPlayerImg.png"
                }
                leftPlayerName={match.player_one?.name || "Player One"}
                rightPlayerName={match.player_two?.name || "Player Two"}
                totalVotes={match.total_vote ?? 0}
                isVoting={votingId === match.id}
                onVote={() => handleVote(match.id)}
              />
            ))}
          </div>
        )}

        {!isLoading && !data?.data?.length && (
          <div className="rounded-[18px] border border-white/10 bg-white/5 px-6 py-12 text-center text-sm text-white/60">
            No voting matches available right now.
          </div>
        )}
      </div>
    </section>
  );
}
