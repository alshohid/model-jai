import { baseApi } from "@/redux/api/baseApi";
import { ApiResponse } from "@/types/common/api";

import {
  IBuyPointParams,
  IBuyPointResponse,
  IConnectStripeResponse,
  IStripeStatusResponse,
  IWithdrawRequestData,
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
    allWithdrawRequestsList: builder.query<
      ApiResponse<IWithdrawRequestData[]>,
      void
    >({
      query: () => ({
        url: `/admin/withdraws`,
        method: "GET",
      }),
    }),
    acceptWithdrawRequest: builder.mutation<
      ApiResponse<IWithdrawRequestData>,
      { id: string }
    >({
      query: (body) => ({
        url: `/admin/withdraws/accept/${body.id}`,
        method: "POST",
      }),
    }),
    rejectWithdrawRequest: builder.mutation<
      ApiResponse<IWithdrawRequestData>,
      { id: string }
    >({
      query: (body) => ({
        url: `/admin/withdraws/reject/${body.id}`,
        method: "POST",
      }),
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
} = BuyPointApi;
export default BuyPointApi;
