/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";
import type {
  GamesListResponse,
  UsersForSelectResponse,
  ChallengeCreateResponse,
  ChallengeCreatePayload,
  UserSearchParams,
  ChallengeListResponse,
  ChallengeRequest,
  ChallengeAcceptResponse,
  ChallengeDetailsResponse,
  UserAcceptChallengeResponse,
  AutoAcceptChallengeResponse,
} from "@/types/challenge/challengeTypes";

const ChallengeManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPublicGamesList: builder.query<
      GamesListResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 1000 }) => ({
        url: `/games?page=${page}&per_page=${limit}`,
        method: "GET",
      }),
      providesTags: ["GameList"],
    }),
    getUsersForSelect: builder.query<UsersForSelectResponse, UserSearchParams>({
      query: ({ search }) => ({
        url: `/get_users_for_select`,
        method: "GET",
        params: { search },
      }),
      providesTags: ["ManageUser"],
    }),
    createChallenge: builder.mutation<
      ChallengeCreateResponse,
      ChallengeCreatePayload
    >({
      query: (payload) => {
        const formData = new FormData();

        formData.append("game_id", String(payload.game_id));
        formData.append("amount", String(payload.amount));
        formData.append("match_date", payload.match_date);
        formData.append("match_time", payload.match_time);
        formData.append("mode", payload.mode);
        formData.append("show_real_name", payload.show_real_name ? "1" : "0");
        formData.append("memo", payload.memo);

        if (payload.mode === "unique" && payload.target_player_id) {
          formData.append("target_player_id", String(payload.target_player_id));
        }

        if (payload.logo instanceof File) {
          formData.append("logo", payload.logo);
        }

        return {
          url: `/challenges`,
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["Match"],
    }),

    getAllChallengesList: builder.query<
      ChallengeListResponse,
      ChallengeRequest
    >({
      query: ({ search, page = 1, limit = 10 }) => {
        const params: Record<string, unknown> = { page, per_page: limit };

        if (search) params.search = search;
        return {
          url: `/admin/challenges`,
          method: "GET",
          params,
        };
      },
      providesTags: ["ChallengeManagement"],
    }),
    getAllPublicChallengesList: builder.query<
      ChallengeListResponse,
      ChallengeRequest
    >({
      query: ({ page = 1, limit = 100 }) => {
        const params: Record<string, unknown> = { page, per_page: limit };
        return {
          url: `/challenges`,
          method: "GET",
          params,
        };
      },
      providesTags: ["ChallengeManagement"],
    }),
    getUserAcceptedChallengesList: builder.query<
      ChallengeListResponse,
      ChallengeRequest
    >({
      query: ({ userId, search, page = 1, limit = 10 }) => {
        const params: Record<string, unknown> = { page, per_page: limit };

        if (search) params.search = search;
        return {
          url: `/users/${userId}/accepted-challenges`,
          method: "GET",
          params,
        };
      },
      providesTags: ["ChallengeManagement"],
    }),
    getUserCompletedChallengesList: builder.query<
      ChallengeListResponse,
      ChallengeRequest
    >({
      query: ({ userId, search, page = 1, limit = 10 }) => {
        const params: Record<string, unknown> = { page, per_page: limit };

        if (search) params.search = search;
        return {
          url: `/users/${userId}/completed-challenges`,
          method: "GET",
          params,
        };
      },
      providesTags: ["ChallengeManagement"],
    }),
    getReceivedChallengesList: builder.query<
      ChallengeListResponse,
      ChallengeRequest
    >({
      query: ({ search, page = 1, limit = 10 }) => {
        const params: Record<string, unknown> = { page, per_page: limit };

        if (search) params.search = search;
        return {
          url: `/challenges-for-me`,
          method: "GET",
          params,
        };
      },
      providesTags: ["ChallengeManagement"],
    }),
    getChallengeById: builder.query<ChallengeDetailsResponse, { id: number }>({
      query: ({ id }) => ({
        url: `/challenges/${id}`,
        method: "GET",
      }),
      providesTags: ["ChallengeManagement"],
    }),
    getIndividualChallengeListByUserId: builder.query<
      ChallengeListResponse,
      { id: number }
    >({
      query: ({ id }) => ({
        url: `/users/${id}/challenges`,
        method: "GET",
      }),
      providesTags: ["ChallengeManagement"],
    }),
    adminAcceptChallenge: builder.mutation<
      ChallengeAcceptResponse,
      { id: number }
    >({
      query: ({ id }) => ({
        url: `/admin/challenges/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["ChallengeManagement"],
    }),
    userAcceptChallenge: builder.mutation<
      UserAcceptChallengeResponse,
      { id: number; terms_accepted: boolean }
    >({
      query: ({ id, terms_accepted }) => ({
        url: `/challenges/${id}/accept`,
        method: "POST",
        body: {
          terms_accepted: terms_accepted,
        },
      }),
      invalidatesTags: ["ChallengeManagement"],
    }),
    winnerSelectForChallengeByAdmin: builder.mutation<
      ChallengeAcceptResponse,
      { id: number; winner_id: number }
    >({
      query: ({ id, winner_id }) => ({
        url: `/admin/challenges/${id}/winner`,
        method: "POST",
        body: {
          winner_id: winner_id,
        },
      }),
      invalidatesTags: ["ChallengeManagement"],
    }),

    adminDeclineChallenge: builder.mutation<
      ChallengeAcceptResponse,
      { id: number }
    >({
      query: ({ id }) => ({
        url: `/admin/challenges/${id}/reject`,
        method: "POST",
      }),
      invalidatesTags: ["ChallengeManagement"],
    }),

    toggleAutoAcceptChallenge: builder.mutation<
      AutoAcceptChallengeResponse,
      { value: string }
    >({
      query: ({ value }) => ({
        url: `/admin/settings/auto_offer_challenges`,
        method: "PUT",
        body: {
          value: value,
        },
      }),
      invalidatesTags: ["ChallengeManagement"],
    }),
    getAutoAcceptChallenge: builder.query<AutoAcceptChallengeResponse, void>({
      query: () => ({
        url: `/admin/settings/auto_offer_challenges`,
        method: "GET",
      }),
      providesTags: ["ChallengeManagement"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllPublicGamesListQuery,
  useGetUsersForSelectQuery,
  useCreateChallengeMutation,
  useGetAllChallengesListQuery,
  useGetAllPublicChallengesListQuery,
  useGetChallengeByIdQuery,
  useUserAcceptChallengeMutation,
  useAdminAcceptChallengeMutation,
  useAdminDeclineChallengeMutation,
  useWinnerSelectForChallengeByAdminMutation,
  useGetIndividualChallengeListByUserIdQuery,
  useToggleAutoAcceptChallengeMutation,
  useGetAutoAcceptChallengeQuery,
  useGetUserAcceptedChallengesListQuery,
  useGetUserCompletedChallengesListQuery,
  useGetReceivedChallengesListQuery,
} = ChallengeManagementApi;
export default ChallengeManagementApi;
