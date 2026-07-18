import { mapApiChallengeToOffer } from "./apiAdapter";

export type ChallengeOffer = ReturnType<typeof mapApiChallengeToOffer>;

export function canAcceptOffer(offer: ChallengeOffer, currentUserId: number | null): boolean {
  if (currentUserId == null) return false;
  if (Number(offer.challenger.id) === currentUserId) return false;

  if (offer.mode === "global") return true;

  // mode === "unique"
  return offer.targetPlayerId != null && Number(offer.targetPlayerId) === currentUserId;
}
