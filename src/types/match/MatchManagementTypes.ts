export interface IGame {
  id: number;
  name: string;
  image?: string;
}
export type MatchType = "upcoming" | "live" | "completed";
export type MatchTypePublicUse = "live" | "past" | "upcoming";
// export interface IPlayer {
//   [x: string]: string | undefined;
//   id?: number;
//   name?: string;
//   image_url?: string;
// }
// export interface ISupportPlacedData {
//   support: ISupportRecord;
//   updated_balance: string | number;
//   updated_total_bet: string | number;
//   match_player_one_total: string | number;
//   match_player_two_total: string | number;
//   top_supporters: ITopSupporterItem[];
//   player_one_top_supporter?: ITopSupporterUser | null;
//   player_two_top_supporter?: ITopSupporterUser | null;
// }
export interface IPlayer {
  id?: number;
  name?: string;
  image_url?: string;
  image?: string;
}
export interface ITopSupporterUser {
  id: number;
  name: string;
  image?: string | null;
}

export interface ITopSupporterItem {
  user_id: number;
  serial_no: string;
  supported_amounts: string;
  supporter: ITopSupporterUser;
}

export interface IMatch {
  id: number;
  match_no: string | number;
  platform?: string;
  status: MatchType;

  player_one_id?: number;
  player_two_id?: number;

  player_one_bet?: string | number;
  player_two_bet?: string | number;

  player_one_total: string | number;
  player_two_total: string | number;

  game_id: number | string;
  winner_id: number | null;

  type: MatchType;

  winner_percentage: number;
  loser_percentage: number;

  tiktok_link: string | null;
  twitch_link: string | null;
  voting_time?: string | null;
  player_one_logo?: string | null;
  player_two_logo?: string | null;

  confirmation_status: number;

  match_date: string;
  match_time: string;

  created_at: string;
  updated_at: string;
  rules: string;

  game: IGame;
  player_one: IPlayer;
  player_two: IPlayer;
  winner?: IPlayer | null;

  top_supporters?: ITopSupporterItem[];
  player_one_top_supporter?: ITopSupporterUser | null;
  player_two_top_supporter?: ITopSupporterUser | null;
}
export interface IPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  prev?: boolean;
  next?: boolean;
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
  voting_time: string;

  winner_percentage: number;
  loser_percentage: number;
  rules?: string;

  tiktok_link?: string;
  twitch_link?: string;
  player_one_logo?: File | null;
  player_two_logo?: File | null;
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
