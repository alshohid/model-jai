import { baseApi } from "@/redux/api/baseApi";
import {
  ISupportPayload,
  ISupportResponse,
} from "@/types/support/liveSupportTypes";
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
    placeSupport: builder.mutation<ISupportResponse, ISupportPayload>({
      query: (body) => ({
        url: `/support`,
        method: "POST",
        body,
      }),
    }),

    sendTip: builder.mutation<
      { status: string; message: string },
      { receiver_id: string; tip_amount: number }
    >({
      query: (body) => ({
        url: `/send-tip`,
        method: "POST",
        body,
      }),
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetBigBossSupporterRankingAllDataQuery,
  useGetUserTransactionsQuery,
  usePlaceSupportMutation,
  useSendTipMutation,
} = SupportManagementApi;

export default SupportManagementApi;
