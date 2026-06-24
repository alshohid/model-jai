export type TNotificationDataType =
  | "match.created"
  | "match.completed"
  | "admin.withdrawal.created"
  | "user.withdrawal.completed"
  | "user.withdrawal.declined"
  | "coin.received"
  | "challenge.won"
  | "challenge.lost"
  | "generic";

export interface IRawNotificationData {
  type?: TNotificationDataType | string;
  message?: string;
  match_id?: number;
  withdraw_id?: number;
  withdraw_no?: string;
  user_id?: number;
  user_name?: string;
  sender_id?: number;
  sender_name?: string;
  amount?: number;
  coin_amount?: string;
  usd_amount?: string;
  status?: string;
  rules?: string;
  payout?: number;
  player_ids?: number[];
}

export interface INotificationApiItem {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: IRawNotificationData;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface INotificationsResponse {
  success: boolean;
  message: string;
  data: INotificationApiItem[];
}

export interface IAppNotificationItem {
  id: string;
  category: TNotificationDataType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  raw: IRawNotificationData | unknown;
  rules?: string | null;
  playerIds?: number[] | null;
}
