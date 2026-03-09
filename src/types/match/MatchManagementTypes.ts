export interface IGame {
  id: number;
  name: string;
  image?: string;
}
export type MatchType = "upcoming" | "live" | "completed";
export type MatchTypePublicUse = "live" | "past" | "upcoming";
export interface IPlayer {
  id: number;
  name: string;
  image_url?: string;
}
export interface IMatch {
  id: number;
  match_no: string | number;
  platform?: string;

  player_one_id: number;
  player_two_id: number;

  player_one_bet: string | number;
  player_two_bet: string | number;

  player_one_total: string | number;
  player_two_total: string | number;

  game_id: number | string;

  winner_id: number | null;

  type: MatchType;

  winner_percentage: number;
  loser_percentage: number;

  tiktok_link: string | null;
  twitch_link: string | null;

  confirmation_status: number;

  match_date: string;
  match_time: string;

  created_at: string;
  updated_at: string;

  game: IGame;

  player_one: IPlayer;
  player_two: IPlayer;

  winner?: IPlayer | null;
}
export interface IPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
export interface IMatchListResponse {
  status: boolean;
  message: string;
  data: IMatch[];
  meta: IPaginationMeta;
}
export interface IMatchSingleResponse {
  status: boolean;
  message: string;
  data: IMatch;
}
export interface IMatchCreateResponse {
  status: boolean;
  message: string;
  data: IMatch;
}
export interface IMatchUpdateResponse {
  status: boolean;
  message: string;
  data: IMatch;
}
export interface IMatchBasePayload {
  game_id: number;

  player_one_id: number;
  player_two_id: number;

  players_bet_amount: number;

  type: MatchType;

  match_date: string;
  match_time: string;

  winner_percentage: number;
  loser_percentage: number;

  tiktok_link?: string;
  twitch_link?: string;
}
export type ICreateMatchPayload = IMatchBasePayload;
export interface IUpdateMatchPayload extends IMatchBasePayload {
  id: number;
}
export interface IDeleteMatchResponse {
  status: boolean;
  message: string;
  data: IMatch;
}
