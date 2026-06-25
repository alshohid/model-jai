/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useGetChallengeByIdQuery } from "@/redux/features/challenge/challengeManagement";
import ChallengeMatchDetails from "./ChallengeMatchDetails";
import type { ChallengeMatchOffer, ChallengePlayer, ChallengeMatchKind, ChallengeMatchStatus } from "../types";


function mapApiOfferToChallengeMatchOffer(apiResponse: Record<string, unknown>): ChallengeMatchOffer | null {
    if (!apiResponse) return null;

    const data = apiResponse.data as Record<string, unknown> | undefined;
    if (!data) return null;


    const game = data.game as Record<string, unknown> | undefined;
    const challengerApi = data.challenger as Record<string, unknown> | undefined;
    const targetPlayer = data.target_player as Record<string, unknown> | null | undefined;
    const match_date = data.match_date as string | undefined;
    const match_time = data.match_time as string | undefined;
    const status = data.status as ChallengeMatchStatus;

    const challenger: ChallengePlayer = {
        id: (challengerApi?.id as number) ?? 0,
        name: (challengerApi?.name as string) ?? "Unknown",
        handle: `@${(challengerApi?.name as string)?.replace(/\s+/g, "") ?? "Unknown"}`,
        avatar: (challengerApi?.image as string) ?? "/images/home/avatar_img.png",
        game: (game?.name as string) ?? "Unknown Game",
    };

    const target: ChallengePlayer = targetPlayer
        ? {
            id: (targetPlayer.id as number) ?? 0,
            name: (targetPlayer.name as string) ?? "Unknown",
            handle: `@${(targetPlayer.name as string)?.replace(/\s+/g, "") ?? "Unknown"}`,
            avatar: (targetPlayer.image as string) ?? "/images/home/avatar_img.png",
            game: (game?.name as string) ?? "Unknown Game",
        }
        : {
            id: 0,
            name: "Open Challenge",
            handle: "@OpenChallenge",
            avatar: "/images/home/avatar_img.png",
            game: (game?.name as string) ?? "Unknown Game",
        };

    const amount = parseFloat((data.amount as string) ?? "0");
    const isAccepted = ["accepted", "completed", "expired"].includes(data?.status as string);
    const acceptedPlayer = data.acceptor as Record<string, unknown> | null | undefined;
    const accepted: any = acceptedPlayer
        ? {
            id: (acceptedPlayer.id as number) ?? 0,
            name: (acceptedPlayer.name as string) ?? "??????",
            handle: `@${(acceptedPlayer.name as string)?.replace(/\s+/g, "") ?? "?????"}`,
            avatar: (acceptedPlayer.image as string) ?? "/images/home/avatar_img.png",
            game: (game?.name as string) ?? "Unknown Game",
        }
        : {
            id: 0,
            name: "?????",
            handle: "@?????",
            avatar: "/images/home/avatar_img.png",
            game: (game?.name as string) ?? "Unknown Game",
        };

    return {
        id: String(data.id as number),
        rank: (data.rank as number) ?? 0,
        challenger,
        target,
        accepted,
        acceptedPlayer,
        isAccepted,
        amount: isNaN(amount) ? 0 : amount,
        game: (game?.name as string) ?? "Unknown Game",
        memo: (data.memo as string) ?? "",
        durationHours: (data.duration_hours as number) ?? 24,
        kind: ((data.mode as string) === "unique" ? "challenge" : "supporting") as ChallengeMatchKind,
        showRealName: Boolean(data.show_real_name),
        createdAt: (data.created_at as string) ?? new Date().toISOString(),
        mode: (data.mode as "unique" | "global") ?? "global",
        targetPlayerId: (data.target_player ? (targetPlayer?.id as number) : null) ?? null,
        match_date: match_date as any,
        match_time: match_time as any,
        status: status as any,
    };
}

export default function ChallengeOfferDetailsClient({
    offerId: propOfferId,
    refCode,
}: {
    offerId: string;
    refCode?: string;
}) {
    const paramsOfferId = useParams()?.offerId as string | undefined;
    const offerId = propOfferId ?? paramsOfferId ?? "";

    const numericId = Number(offerId);
    const { data: response, isLoading, isError } = useGetChallengeByIdQuery(
        { id: numericId },
        { skip: !numericId || isNaN(numericId) },
    );

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#090a0f]">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#ff37dc] border-t-transparent" />
                    <p className="mt-4 text-sm text-white/60">Loading challenge details...</p>
                </div>
            </div>
        );
    }

    if (isError || !response) {
        notFound();
    }

    const offer = mapApiOfferToChallengeMatchOffer(response as unknown as Record<string, unknown>);

    if (!offer) {
        notFound();
    }

    return <ChallengeMatchDetails offer={offer} refCode={refCode} />;
}