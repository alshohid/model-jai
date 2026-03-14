import { baseApi } from "@/redux/api/baseApi";
import {
  IAdminEarningChartDataResponse,
  IRecentMatchDataResponse,
} from "@/types/dashboard/dashboardManagementTypes";
import { IMatchListResponse } from "@/types/match/MatchManagementTypes";

const DashboardManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminEarningChartData: builder.query<
      IAdminEarningChartDataResponse,
      { year: string }
    >({
      query: (params) => {
        return {
          url: `/admin/earnings`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["Dashboard"],
    }),
    getRecentMatchData: builder.query<IRecentMatchDataResponse, void>({
      query: () => {
        return {
          url: `/admin/recent-streams`,
          method: "GET",
        };
      },
      providesTags: ["Dashboard"],
    }),
    getUpcomingMatchData: builder.query<
      IMatchListResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit = 30 }: { page: number; limit: number }) => {
        return {
          url: `/admin/running-matches?page=${page}&per_page=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["Match"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminEarningChartDataQuery,
  useGetRecentMatchDataQuery,
  useGetUpcomingMatchDataQuery,
} = DashboardManagementApi;
export default DashboardManagementApi;
