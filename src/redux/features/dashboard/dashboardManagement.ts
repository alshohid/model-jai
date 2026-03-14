import { baseApi } from "@/redux/api/baseApi";
import {
  IAdminEarningChartDataResponse,
  IRecentMatchDataResponse,
} from "@/types/dashboard/dashboardManagementTypes";

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
  }),
  overrideExisting: true,
});

export const { useGetAdminEarningChartDataQuery, useGetRecentMatchDataQuery } =
  DashboardManagementApi;
export default DashboardManagementApi;
