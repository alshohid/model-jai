import type { ChallengeMatchOffer } from "./types";

const gameLogoByName: Record<string, string> = {
  FC26: "/images/home/fc26.png",
  "Mortal Combat": "/images/home/mortal.png",
  "FIFA 23": "/images/home/game_3.png",
  "Street Fighter 6": "/images/home/game_14.png",
};

export function getDisplayName(offer: ChallengeMatchOffer) {
  return offer.showRealName
    ? offer.challenger.name
    : offer.challenger.handle.replace("@", "");
}

export function getGameLogo(game: string) {
  return gameLogoByName[game] ?? "/images/home/main_logo.png";
}

export const formatChallengePoints = (value: number | string) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) return `${value}`;

  return `${new Intl.NumberFormat("en-US").format(numericValue)}`;
};

export const formatChallengeCurrency = (value: number | string) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) return `${value} ₱`;

  return `${new Intl.NumberFormat("en-US").format(numericValue)} ₱`;
};
