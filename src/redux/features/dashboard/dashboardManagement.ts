/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";
import {
  IAdminEarningChartDataResponse,
  IRecentMatchDataResponse,
} from "@/types/dashboard/dashboardManagementTypes";
import { ILiveStatusChangedEvent } from "@/types/liveMatchDetails/liveStatus";
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
    getStartLiveMatchData: builder.query<ILiveStatusChangedEvent, void>({
      query: () => {
        return {
          url: `/admin/dashboard`,
          method: "GET",
        };
      },
      providesTags: ["Match"],
    }),
    getLiveStatus: builder.query<any, void>({
      query: () => {
        return {
          url: `/get_live_staus`,
          method: "GET",
        };
      },
      providesTags: ["Match"],
    }),
    changeMatchStatus: builder.mutation<
      ILiveStatusChangedEvent,
      { platform_name: string; status: string; mode: string }
    >({
      query: (data) => {
        return {
          url: `/admin/dashboard/change_live_status`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Match"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminEarningChartDataQuery,
  useGetRecentMatchDataQuery,
  useGetUpcomingMatchDataQuery,
  useChangeMatchStatusMutation,
  useGetLiveStatusQuery,
  useGetStartLiveMatchDataQuery,
} = DashboardManagementApi;
export default DashboardManagementApi;
