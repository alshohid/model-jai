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
  }),
  overrideExisting: true,
});

export const {
  useGetAllPublicGamesListQuery,
  useGetUsersForSelectQuery,
  useCreateChallengeMutation,
  useGetAllChallengesListQuery,
  useGetAllPublicChallengesListQuery,
  useAdminAcceptChallengeMutation,
  useAdminDeclineChallengeMutation,
} = ChallengeManagementApi;
export default ChallengeManagementApi;
