/* eslint-disable @typescript-eslint/no-explicit-any */

// GET /games response
export interface GameOption {
  id: number;
  name: string;
  image: string;
}

export interface GamesListMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  prev: boolean;
  next: boolean;
}

export interface GamesListResponse {
  status: boolean;
  message: string;
  data: GameOption[];
  meta: GamesListMeta;
}

// GET /get_users_for_select?search=... response
export interface UserForSelect {
  id: number;
  artist: string | null;
  role: "user" | "artist";
}

export interface UsersForSelectResponse {
  success: boolean;
  message: string;
  data: UserForSelect[];
}

// POST /challenges response
export interface ChallengeCreateResponse {
  success: boolean;
  message: string;
  data: {
    challenge_no: string;
    amount_deducted: number;
    remaining_balance: number | null;
    duration: string;
  };
}

// Payload for creating a challenge
export interface ChallengeCreatePayload {
  game_id: number;
  amount: number;
  match_date: string;
  match_time: string;
  mode: "unique" | "global";
  target_player_id?: number | null;
  show_real_name: boolean;
  memo: string;
  logo?: File | null;
}

export interface UserSearchParams {
  search: string;
}

// Challenge list response
export interface ChallengeListResponse {
  status: boolean;
  message: string;
  data: ChallengeItem[];
  meta: PaginationMeta;
}

export interface ChallengeItem {
  id: number;
  challenge_no: string | number;
  rank: unknown;
  mode: string;
  status: string;
  amount: string;
  matchedPoints: string;
  logo?: string;
  memo: string;
  showRealName: boolean;
  durationHours: number;
  durationLabel: string;
  matchDate: string;
  matchTime: string;
  offerExpiresAt: string;
  game: GameInfo;
  challenger: PlayerInfo;
  target_player?: PlayerInfo | null;
  acceptor: PlayerInfo | null;
  winnerId: number | null;
  createdAt: string;
}

export interface GameInfo {
  id: number;
  name: string;
  image: string;
}

export interface PlayerInfo {
  id: number;
  name: string;
  image: string;
}

export interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  prev: boolean;
  next: boolean;
}

export interface ChallengeRequest {
  search?: string;
  page?: number;
  limit?: number;
}
export interface ChallengeAcceptResponse {
  status: boolean;
  message: string;
}
export interface UserAcceptChallengeResponse {
  success: boolean;
  message: string;
}
export type ChallengeDetailsResponse = ChallengeListResponse;
