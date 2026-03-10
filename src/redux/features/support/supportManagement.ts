import { baseApi } from "@/redux/api/baseApi";
import {
  IBigBossSupporterResponse,
  IUserTransactionsResponse,
} from "@/types/support/supportmanagement";

const SupportManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBigBossSupporterRankingAllData: builder.query<
      IBigBossSupporterResponse,
      void
    >({
      query: () => ({
        url: `/bigboss-supporter`,
        method: "GET",
      }),
    }),

    getUserTransactions: builder.query<
      IUserTransactionsResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page, limit }) => ({
        url: `/user-transactions?page=${page}&per_page=${limit}`,
        method: "GET",
      }),
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetBigBossSupporterRankingAllDataQuery,
  useGetUserTransactionsQuery,
} = SupportManagementApi;

export default SupportManagementApi;
