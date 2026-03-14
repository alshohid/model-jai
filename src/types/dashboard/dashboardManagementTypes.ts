export interface IAdminEarningChartData {
  month: string;
  total: number;
}

export interface IAdminEarningChartDataResponse {
  success: boolean;
  message: string;
  data: IAdminEarningChartData[];
}
export interface IRecentMatchData {
  match_no: string;
  total_earnings: string;
}
export interface IRecentMatchDataResponse {
  success: boolean;
  message: string;
  data: IRecentMatchData[];
}
