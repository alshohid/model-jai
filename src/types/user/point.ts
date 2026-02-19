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
