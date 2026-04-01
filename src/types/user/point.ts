export interface IBuyPointParams {
  amount: number;
}

export interface IBuyPointResponse {
  url: string;
}
export interface IStripeStatusResponse {
  connected: boolean;
}
export interface IConnectStripeResponse {
  url: string;
}
export interface IWithdrawRequestData {
  id: number;
  user_id: number;
  withdraw_no: string;
  coin_amount: number;
  usd_amount: number;
  status: "pending" | "paid" | "accepted" | "declined";
  created_at: string;
  updated_at: string;
}
interface Support {
  match_id: number;
  match_no: string;
  supported_player_id: number;
  user_id: number;
  coin_amount: number;
  result: string;
  updated_at: string;
  created_at: string;
  id: number;
}

interface Supporter {
  id: number;
  name: string;
  image: string | null;
}

interface TopSupporter {
  user_id: number;
  serial_no: string;
  supported_amounts: string;
  supporter: Supporter;
}

interface SupportData {
  support: Support;
  updated_balance: string;
  updated_total_bet: string;
  match_player_one_total: string;
  match_player_two_total: string;
  top_supporters: TopSupporter[];
}

export interface SupportResponse {
  status: boolean;
  message: string;
  data: SupportData;
}
