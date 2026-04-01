import { baseApi } from "@/redux/api/baseApi";
import { ApiResponse } from "@/types/common/api";

import {
  IBuyPointParams,
  IBuyPointResponse,
  IConnectStripeResponse,
  IStripeStatusResponse,
  IWithdrawRequestData,
  SupportResponse,
} from "@/types/user/point";

const BuyPointApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    buyPoint: builder.mutation<ApiResponse<IBuyPointResponse>, IBuyPointParams>(
      {
        query: (body) => ({
          url: "/checkout",
          method: "POST",
          body,
        }),
      },
    ),
    getStripeStatus: builder.query<IStripeStatusResponse, void>({
      query: () => ({
        url: `/stripe/status`,
        method: "GET",
      }),
    }),
    connectStripe: builder.mutation<ApiResponse<IConnectStripeResponse>, void>({
      query: () => ({
        url: `/stripe/connect`,
        method: "POST",
      }),
    }),
    sendCoin: builder.mutation<
      SupportResponse,
      { receiver_id: number; amount: number }
    >({
      query: (body) => ({
        url: `/send-coin`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    withdrawRequest: builder.mutation<
      ApiResponse<IWithdrawRequestData>,
      { coin_amount: number }
    >({
      query: (body) => ({
        url: `/withdraw/request`,
        method: "POST",
        body,
      }),
    }),
    getAutoAcceptStatus: builder.query({
      query: () => ({
        url: `admin/settings/auto_accept_withdraw`,
        method: "GET",
      }),
      providesTags: ["Withdraw"],
    }),
    toggleAutoAcceptStatus: builder.mutation({
      query: (body: { value: string }) => ({
        url: `admin/settings/auto_accept_withdraw`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Withdraw"],
    }),
    allWithdrawRequestsList: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/withdraws?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Withdraw"],
    }),
    acceptWithdrawRequest: builder.mutation<
      ApiResponse<IWithdrawRequestData>,
      { id: string }
    >({
      query: (body) => ({
        url: `/admin/withdraws/accept/${body.id}`,
        method: "POST",
      }),
      invalidatesTags: ["Withdraw"],
    }),
    rejectWithdrawRequest: builder.mutation<
      ApiResponse<IWithdrawRequestData>,
      { id: string }
    >({
      query: (body) => ({
        url: `/admin/withdraws/declined/${body.id}`,
        method: "POST",
      }),
      invalidatesTags: ["Withdraw"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useBuyPointMutation,
  useGetStripeStatusQuery,
  useConnectStripeMutation,
  useWithdrawRequestMutation,
  useAllWithdrawRequestsListQuery,
  useAcceptWithdrawRequestMutation,
  useRejectWithdrawRequestMutation,
  useGetAutoAcceptStatusQuery,
  useToggleAutoAcceptStatusMutation,
  useSendCoinMutation,
} = BuyPointApi;
export default BuyPointApi;
