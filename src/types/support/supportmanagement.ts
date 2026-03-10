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
