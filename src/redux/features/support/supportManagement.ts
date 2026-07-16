import { baseApi } from "@/redux/api/baseApi";
import {
  ISupportPayload,
  ISupportResponse,
} from "@/types/support/liveSupportTypes";
import {
  IBigBossSupporterResponse,
  IPastSupportResponse,
  ISupportHistoryResponse,
  ITwitchLiveStatusResponse,
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
    getAdminTransaction: builder.query<
      IUserTransactionsResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page, limit, search }) => ({
        url: `admin/all-transaction`,
        method: "GET",
        params: {
          page,
          per_page: limit,
          search: search,
        },
      }),
    }),
    getSupportHistory: builder.query<
      ISupportHistoryResponse,
      {
        page?: number;
        limit?: number;
        type?: "settled" | "unsettled" | "live" | "all";
      }
    >({
      query: ({ page = 1, limit = 10, type = "all" }) => {
        const params = new URLSearchParams();

        params.append("page", String(page));
        params.append("per_page", String(limit));

        if (type !== "all") {
          params.append("type", type);
        }

        return {
          url: `/support-history?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    getPastMatchSupportList: builder.query<
      IPastSupportResponse,
      {
        page?: number;
        limit?: number;
      }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/past-supports?page=${page}&per_page=${limit}`,
        method: "GET",
      }),
    }),
    getTikTokAndTwitchLiveStatus: builder.query<
      ITwitchLiveStatusResponse,
      void
    >({
      query: () => ({
        url: `/twitch/check_live`,
        method: "GET",
      }),
    }),
    placeSupport: builder.mutation<ISupportResponse, ISupportPayload>({
      query: (body) => ({
        url: `/support`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
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
      invalidatesTags: ["User"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetBigBossSupporterRankingAllDataQuery,
  useGetUserTransactionsQuery,
  useGetSupportHistoryQuery,
  useGetPastMatchSupportListQuery,
  useGetTikTokAndTwitchLiveStatusQuery,
  usePlaceSupportMutation,
  useSendTipMutation,
  useGetAdminTransactionQuery,
} = SupportManagementApi;

export default SupportManagementApi;
