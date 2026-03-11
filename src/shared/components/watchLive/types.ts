/**
 * Shared types and interfaces for Watch Live components
 * Following Interface Segregation Principle - focused, minimal interfaces
 */

export type SupportSide = "left" | "right" | "middle";

export type MatchMode = "tiktok" | "twitch";

export type StreamStatus = "live" | "offline" | "starting";

export interface PlayerInfo {
  name: string;
  points: number;
  imageSrc: string;
}

export interface TeamInfo {
  playerName: string;
  teamLogoSrc: string;
  points: number;
  playerId: number;
}

export interface BossInfo {
  name: string;
  total: number;
}

export interface MiddlePanelInfo {
  label: string;
  imageSrc: string;
}

export type SupportHandler = (amount: number, supporterName?: string) => void;

export type SupportConfirmHandler = (
  side: SupportSide,
  supporterName: string,
  amount: number,
) => void;
