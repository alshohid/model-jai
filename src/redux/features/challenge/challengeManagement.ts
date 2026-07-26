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
  MakeChallengeOfficialPayload,
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
    makeChallengeOfficial: builder.mutation<
      ChallengeAcceptResponse,
      MakeChallengeOfficialPayload
    >({
      query: (payload) => {
        const formData = new FormData();

        if (payload.player_one_logo instanceof File) {
          formData.append("player_one_logo", payload.player_one_logo);
        }
        if (payload.player_two_logo instanceof File) {
          formData.append("player_two_logo", payload.player_two_logo);
        }
        formData.append(
          "winner_percentage",
          payload.winner_percentage ? "1" : "0",
        );
        formData.append(
          "loser_percentage",
          payload.loser_percentage ? "1" : "0",
        );
        if (payload.tiktok_link) {
          formData.append("tiktok_link", payload.tiktok_link);
        }
        if (payload.twitch_link) {
          formData.append("twitch_link", payload.twitch_link);
        }
        if (payload.rules) {
          formData.append("rules", payload.rules);
        }
        formData.append("is_free", payload.is_free ? "1" : "0");
        formData.append("is_ranked", payload.is_ranked ? "1" : "0");
        formData.append("is_featured", payload.is_featured ? "1" : "0");

        return {
          url: `/admin/challenges/${payload.id}/publish-match`,
          method: "POST",
          body: formData,
          formData: true,
        };
      },
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
    confirmChallengeReady: builder.mutation<
      { status: boolean; message: string; data: any },
      {
        id: number | string;
        battery_confirmed: boolean;
        internet_confirmed: boolean;
        camera_confirmed: boolean;
        rules_confirmed: boolean;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/challenges/${id}/ready`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ChallengeManagement"],
    }),
    submitChallengeResult: builder.mutation<
      { status: boolean; message: string; data: any },
      {
        id: number | string;
        notes?: string;
        evidence_image?: File | null;
        evidence_video?: File | null;
      }
    >({
      query: ({ id, notes, evidence_image, evidence_video }) => {
        const formData = new FormData();
        if (notes) formData.append("notes", notes);
        if (evidence_image instanceof File)
          formData.append("evidence_image", evidence_image);
        if (evidence_video instanceof File)
          formData.append("evidence_video", evidence_video);
        return {
          url: `/challenges/${id}/submit-result`,
          method: "POST",
          body: formData,
          formData: true,
        };
      },
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
  useMakeChallengeOfficialMutation,
  useConfirmChallengeReadyMutation,
  useSubmitChallengeResultMutation,
} = ChallengeManagementApi;
export default ChallengeManagementApi;

