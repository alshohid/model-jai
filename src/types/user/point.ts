export type PaymentMethodId = "stripe" | "paypal" | "moncash" | "bitpay";

export interface IBuyPointParams {
  amount: number;
  payment_method: PaymentMethodId;
}

export interface IBuyPointResponse {
  url: string;
}
export interface IPaymentStatusResponse {
  connected: boolean;
  paypal_email?: string | null;
  moncash_number?: string | null;
  bitpay_wallet?: string | null;
  stripe_email?: string | null;
  stripe_account_email?: string | null;
  stripe_account_id?: string | null;
  email?: string | null;
  account_id?: string | null;
}

export interface IConnectPaymentResponse {
  url?: string;
  connected?: boolean;
  paypal_email?: string | null;
  moncash_number?: string | null;
  bitpay_wallet?: string | null;
  stripe_email?: string | null;
  stripe_account_email?: string | null;
  stripe_account_id?: string | null;
  email?: string | null;
  account_id?: string | null;
}

export interface IConnectPaymentMethodParams {
  paymentMethod: PaymentMethodId;
  paypal_email?: string;
  moncash_number?: string;
  bitpay_wallet?: string;
}

export interface IWithdrawRequestParams {
  coin_amount: number;
  payment_method?: PaymentMethodId;
}
export interface IWithdrawRequestData {
  id: number;
  user_id: number;
  withdraw_no: string;
  coin_amount: number;
  usd_amount: number;
  payment_method?: PaymentMethodId;
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
