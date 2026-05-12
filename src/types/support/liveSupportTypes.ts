import { ITopSupporterUser } from "../match/MatchManagementTypes";

export interface ISupportPayload {
  match_id: number;
  supported_player_id: number;
  coin_amount: number;
}

export interface ISupporterInfo {
  id: number;
  name: string;
  image?: string | null;
}

export interface ITopSupporterItem {
  user_id: number;
  serial_no: string;
  supported_amounts: string;
  supporter: ISupporterInfo;
}

export interface ISupportRecord {
  id: number;
  match_id: number;
  match_no: string;
  supported_player_id: number;
  user_id: number;
  coin_amount: number;
  result: string;
  created_at: string;
  updated_at: string;
}

export interface ISupportPlacedData {
  support: ISupportRecord;
  updated_balance: string | number;
  updated_total_bet: string | number;
  match_player_one_total: string | number;
  match_player_two_total: string | number;
  top_supporters: ITopSupporterItem[];
  player_one_top_supporter?: ITopSupporterUser | null;
  player_two_top_supporter?: ITopSupporterUser | null;
  player_one_total_supporter?: number | null;
  player_two_total_supporter?: number | null;
}

export interface ISupportResponse {
  status: boolean;
  message: string;
  data: ISupportPlacedData;
}

export interface ISupportPlacedEvent {
  data: ISupportPlacedData;
  matchId: number;
}
