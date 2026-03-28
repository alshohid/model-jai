import { IPaginationMeta } from "@/types/match/MatchManagementTypes";

export interface IPopularArtistPlayer {
  id: number;
  name: string;
  image?: string | null;
  image_url?: string | null;
}

export interface IPopularArtistGame {
  id: number;
  name: string;
  image?: string | null;
}

export interface IPopularArtist {
  id: number;
  game_id: number;
  player_one_id: number;
  player_two_id: number;
  total_vote: number;
  created_at: string;
  updated_at: string;
  game: IPopularArtistGame;
  player_one: IPopularArtistPlayer;
  player_two: IPopularArtistPlayer;
}

export interface IPopularArtistListResponse {
  status: boolean;
  message: string;
  data: IPopularArtist[];
  meta?: IPaginationMeta;
}

export interface IPopularArtistSingleResponse {
  status: boolean;
  message: string;
  data: IPopularArtist;
}

export interface ICreatePopularArtistPayload {
  game_id: number;
  player_one_id: number;
  player_two_id: number;
}

export interface IUpdatePopularArtistPayload extends ICreatePopularArtistPayload {
  id: number;
}

export interface IDeletePopularArtistResponse {
  status: boolean;
  message: string;
  data: IPopularArtist;
}
