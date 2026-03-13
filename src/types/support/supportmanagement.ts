export interface IBigBossSupporterResponse {
  status: boolean;
  message: string;
  data: IBigBossSupporterItem[];
}

export interface IBigBossSupporterItem {
  user_id: number;
  serial_no: string;
  supported_amounts: string;
  supporter: ISupporter;
}

export interface ISupporter {
  id: number;
  name: string;
  image?: string;
}
export type TransactionType = "withdraw" | "recharge";

export interface IUserTransactionItem {
  id: number;
  user_id: number;
  type: TransactionType;
  amount: string;
  balance_after: string;
  reference: string;
  created_at: string;
  updated_at: string;
}

export interface IUserTransactionMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  prev: boolean;
  next: boolean;
}

export interface IUserTransactionsResponse {
  status: boolean;
  message: string;
  data: IUserTransactionItem[];
  meta: IUserTransactionMeta;
}
export type SupportHistoryMatchType = "upcoming" | "live" | "completed";
export type SupportHistoryResult = "pending" | "win" | "lose" | "cancelled";

export interface ISupportHistoryPlayer {
  name: string;
  image: string;
}

export interface ISupportHistoryItem {
  match_id: number;
  match_no: string | number;
  match_date: string;
  match_time: string;
  type: SupportHistoryMatchType;
  confirmation_status: number;
  player_one: ISupportHistoryPlayer;
  player_two: ISupportHistoryPlayer;
  coin_amount: string;
  result: SupportHistoryResult;
}

export interface ISupportHistoryMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  prev: boolean;
  next: boolean;
}

export interface ISupportHistoryResponse {
  status: boolean;
  message: string;
  data: ISupportHistoryItem[];
  meta: ISupportHistoryMeta;
}

export type PastSupportResult = "pending" | "win" | "loss";

export interface IPastSupportItem {
  rank_no: string;
  game_name: string;
  match_no: string | number;
  supported_player: string;
  result: PastSupportResult;
  range_points: string[];
}

export interface IPastSupportMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  prev: boolean;
  next: boolean;
}

export interface IPastSupportResponse {
  status: boolean;
  message: string;
  data: IPastSupportItem[];
  meta: IPastSupportMeta;
}
