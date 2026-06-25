import type { ChallengeMatchOffer, ChallengePlayer } from "../types";

export const challengePlayers: ChallengePlayer[] = [
  {
    id: 11,
    name: "Master Jay Model",
    handle: "@MasterJay",
    avatar: "/images/home/profile_img.png",
    game: "FC26",
  },
  {
    id: 12,
    name: "Junior",
    handle: "@JuniorBoss",
    avatar: "/images/home/pro_2.jpg",
    game: "Mortal Combat",
  },
  {
    id: 13,
    name: "Breezy",
    handle: "@Breezy",
    avatar: "/images/home/pro_3.jpg",
    game: "FIFA 23",
  },
  {
    id: 14,
    name: "Fat Le Sage",
    handle: "@FatLeSage",
    avatar: "/images/home/pro_4.jpg",
    game: "FC26",
  },
  {
    id: 15,
    name: "Model Boss",
    handle: "@ModelBoss",
    avatar: "/images/home/avatar_img.png",
    game: "FC26",
  },
];

export const challengeGames = [
  { id: "fc26", name: "FC26" },
  { id: "mortal-combat", name: "Mortal Combat" },
  { id: "fifa-23", name: "FIFA 23" },
  { id: "street-fighter-6", name: "Street Fighter 6" },
];

export const challengeAmounts = [
  "1000",
  "3000",
  "5000",
  "6000",
  "8000",
  "10000",
];
