/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export type CredentialProvider =
  | "mail"
  | "stripe"
  | "paypal"
  | "moncash"
  | "bitpay"
  | "twitch"
  | "facebook"
  | "google";

export type CredentialValues = Record<string, string | null>;

export type CredentialsResponse = Partial<
  Record<CredentialProvider, CredentialValues>
>;

export const credentialsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCredentials: builder.query<CredentialsResponse, void>({
      query: () => ({
        url: "/admin/credentials",
        method: "GET",
      }),
      providesTags: ["Credentials"],
      transformResponse: (response: any) => {
        return response?.data ?? response;
      },
    }),

    updateCredential: builder.mutation<
      any,
      {
        provider: CredentialProvider;
        body: CredentialValues;
      }
    >({
      query: ({ provider, body }) => ({
        url: `/admin/credentials/${provider}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Credentials"],
    }),
  }),
});

export const { useGetCredentialsQuery, useUpdateCredentialMutation } =
  credentialsApi;
