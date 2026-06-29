import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { toast } from "sonner";
import constants from "@/constant";
import { logOut, setCredentials } from "../features/auth/authSlice";
import { ILoginParams, ILoginPayload } from "@/types/user/auth";
import { requestTokenRefresh } from "@/shared/lib/auth/tokenRefresh";

const baseQuery = fetchBaseQuery({
  baseUrl: constants.baseApiURL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

type RefreshResult = QueryReturnValue<
  unknown,
  FetchBaseQueryError,
  FetchBaseQueryMeta
>;

let refreshPromise: Promise<RefreshResult> | null = null;
let isRefreshing = false;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const state = api.getState() as RootState;

    if (state.auth.token) {
      try {
        if (!isRefreshing) {
          isRefreshing = true;

          const state = api.getState() as RootState;
          const refreshCredential = state.auth.refreshToken ?? state.auth.token;

          if (!refreshCredential) {
            throw new Error("No token available for refresh");
          }

          refreshPromise = requestTokenRefresh(refreshCredential, {
            source: "401-fallback",
            reason: "api-401",
          })
            .then((tokens) => ({
              data: {
                data: {
                  access_token: tokens.accessToken,
                  refresh_token: tokens.refreshToken,
                },
              },
            }))
            .catch((error) => {
              throw error;
            }) as Promise<RefreshResult>;

          const refreshResult = await refreshPromise;

          if (refreshResult?.data) {
            const accessToken =
              (refreshResult.data as { data?: { access_token?: string } })?.data
                ?.access_token ?? null;
            const refreshToken =
              (
                refreshResult.data as {
                  data?: { refresh_token?: string | null };
                }
              )?.data?.refresh_token ?? null;

            if (!accessToken) {
              throw new Error("No access token in refresh response");
            }

            api.dispatch(
              setCredentials({
                token: accessToken,
                role: state.auth.role,
                refreshToken: refreshToken ?? state.auth.refreshToken,
              }),
            );
          } else {
            throw new Error("Refresh failed");
          }
        } else {
          await refreshPromise;
        }

        // Retry original request with new token
        result = await baseQuery(args, api, extraOptions);
      } catch (error) {
        api.dispatch(logOut());
        // toast.error("Session expired — please log in again.", {
        //   description: getErrorMessage(error),
        // });
        toast.error("Session expired — please log in again.");
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }
  }

  return result;
};
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Withdraw",
    "User",
    "ManageUser",
    "GameCategory",
    "GameList",
    "Match",
    "Gallery",
    "News",
    "Dashboard",
    "Notification",
    "PopularArtist",
    "UserPost",
    "Credentials",
    "ChallengeManagement",
    "PromotionalOffers",
  ],
  endpoints: (builder) => ({
    login: builder.mutation<ILoginPayload, ILoginParams>({
      query: (credentialParams) => ({
        url: "/login",
        method: "POST",
        body: credentialParams,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          const { handleAuthSuccess } =
            await import("../features/auth/authHelpers");
          handleAuthSuccess(data, dispatch);
        } catch {}
      },
    }),
  }),
});

export const { useLoginMutation } = baseApi;
