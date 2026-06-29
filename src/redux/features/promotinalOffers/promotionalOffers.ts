/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/redux/api/baseApi";
import {
  IAddPromotionalOffersParams,
  IAddPromotionalOffersResponse,
  IPromotionalOffersData,
} from "./types";

export const promotionalOffersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminPromotionalOffers: builder.query<IPromotionalOffersData, void>({
      query: () => ({
        url: "/admin/promotional-terms",
        method: "GET",
      }),
      providesTags: ["PromotionalOffers"],
      transformResponse: (response: any) => {
        return response?.data ?? response;
      },
    }),
    getPublicPromotionalOffers: builder.query<IPromotionalOffersData, void>({
      query: () => ({
        url: "/promotional-terms",
        method: "GET",
      }),
      providesTags: ["PromotionalOffers"],
      transformResponse: (response: any) => {
        return response?.data ?? response;
      },
    }),

    addAdminPromotionalOffers: builder.mutation<
      IAddPromotionalOffersResponse,
      IAddPromotionalOffersParams
    >({
      query: (params) => ({
        url: "/admin/promotional-terms",
        method: "PUT",
        body: params,
      }),
      invalidatesTags: ["PromotionalOffers"],
    }),
  }),
});

export const {
  useGetPublicPromotionalOffersQuery,
  useGetAdminPromotionalOffersQuery,
  useAddAdminPromotionalOffersMutation,
} = promotionalOffersApi;
