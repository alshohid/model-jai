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
