export type TLivePlatformName = "twitch" | "tiktok" | string;
export type TLivePlatformStatus = "live" | "pause" | "stop" | string;
export type TLiveMode = "portrait" | "landscape" | string;

export interface ILiveStatusData {
  id: number;
  platform_name: TLivePlatformName;
  platform_live_status: TLivePlatformStatus;
  mode: TLiveMode;
  live_started_at: string | null;
  live_stopped_at: string | null;
  live_status: ILiveStatusData[];
}

export interface IStartLiveMatchResponse {
  success: boolean;
  message: string;
  data: ILiveStatusData;
}

export interface ILiveStatusChangedEvent {
  data: ILiveStatusData;
}
