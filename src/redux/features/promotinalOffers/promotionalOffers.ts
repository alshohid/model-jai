
import { baseApi } from "@/redux/api/baseApi";
import { IAddPromotinalOffersParams, IAddPromotinalOffersResponse, IPromotinalOffersListResponse } from "./types";


export const promotionalOffersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminPromotinalOffers: builder.query<IPromotinalOffersListResponse, void>({
      query: () => ({
        url: "/admin/promotional-terms",
        method: "GET",
      }),
      providesTags: ["PromotinalOffers"],
      transformResponse: (response: any) => {
        return response?.data ?? response;
      },
    }),
    getPublicPromotinalOffers: builder.query<IPromotinalOffersListResponse, void>({
      query: () => ({
        url: "/promotional-terms",
        method: "GET",
      }),
      providesTags: ["PromotinalOffers"],
      transformResponse: (response: any) => {
        return response?.data ?? response;
      },
    }),

    addAdminPromotinalOffers: builder.mutation<IAddPromotinalOffersResponse, IAddPromotinalOffersParams >({
      query: (params) => ({
        url: "/admin/promotional-terms",
        method: "PUT",
        body: params
      }),
      invalidatesTags: ["PromotinalOffers"],
    }),
  }),
});

export const { useGetPublicPromotinalOffersQuery, useGetAdminPromotinalOffersQuery, useAddAdminPromotinalOffersMutation } =
  promotionalOffersApi;
