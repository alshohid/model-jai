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
import { getErrorMessage } from "@/lib/utils";
import constants from "@/constant";
import { logOut, setCredentials } from "../features/auth/authSlice";
import {
  ILoginParams,
  ILoginPayload,
  IRefreshTokenPayload,
} from "@/types/user/auth";

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

const extractRefreshTokens = (payload: IRefreshTokenPayload) => {
  const accessToken = payload?.data?.access_token ?? null;
  const refreshToken = payload?.data?.access_token ?? null;

  return { accessToken, refreshToken };
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const state = api.getState() as RootState;

    // Only attempt refresh if user was logged in
    if (state.auth.token) {
      try {
        if (!isRefreshing) {
          isRefreshing = true;

          const state = api.getState() as RootState;
          const refreshToken = state.auth.refreshToken;

          refreshPromise = Promise.resolve(
            baseQuery(
              {
                url: "/refresh",
                method: "POST",
                body: { access_token: refreshToken },
              },
              api,
              extraOptions,
            ),
          );

          const refreshResult = await refreshPromise;

          if (refreshResult?.data) {
            const { accessToken, refreshToken } = extractRefreshTokens(
              refreshResult.data as IRefreshTokenPayload,
            );

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

          isRefreshing = false;
        } else {
          await refreshPromise;
        }

        // Retry original request with new token
        result = await baseQuery(args, api, extraOptions);
      } catch (error) {
        isRefreshing = false;
        api.dispatch(logOut());
        toast.error("Session expired — please log in again.", {
          description: getErrorMessage(error),
        });
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
        } catch (error) {
          toast.error(
            getErrorMessage(error, "Login failed. Please try again."),
          );
        }
      },
    }),
  }),
});

export const { useLoginMutation } = baseApi;
