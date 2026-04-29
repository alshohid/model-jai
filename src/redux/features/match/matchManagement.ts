/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";
import {
  ICreateMatchPayload,
  IMatchBasePayload,
  IDeleteMatchResponse,
  IMatchCreateResponse,
  IMatchDetailsResponse,
  IMatchListResponse,
  IMatchSingleResponse,
  IMatchUpdateResponse,
  IUpdateMatchPayload,
} from "@/types/match/MatchManagementTypes";
import {
  ICreatePopularArtistPayload,
  IDeletePopularArtistResponse,
  IPopularArtistListResponse,
  IPopularArtistSingleResponse,
  IUpdatePopularArtistPayload,
} from "@/types/match/popularArtistTypes";

const buildMatchFormData = (payload: IMatchBasePayload) => {
  const formData = new FormData();

  formData.append("game_id", String(payload.game_id));
  formData.append("player_one_id", String(payload.player_one_id));
  formData.append("player_two_id", String(payload.player_two_id));
  formData.append("players_bet_amount", String(payload.players_bet_amount));
  formData.append("type", payload.type);
  formData.append("match_date", payload.match_date);
  formData.append("match_time", payload.match_time);
  formData.append("voting_time", payload.voting_time);
  formData.append("winner_percentage", String(payload.winner_percentage));
  formData.append("loser_percentage", String(payload.loser_percentage));
  formData.append("rules", payload.rules ?? "");
  formData.append("tiktok_link", payload.tiktok_link ?? "");
  formData.append("twitch_link", payload.twitch_link ?? "");

  if (payload.player_one_logo instanceof File) {
    formData.append("player_one_logo", payload.player_one_logo);
  }

  if (payload.player_two_logo instanceof File) {
    formData.append("player_two_logo", payload.player_two_logo);
  }

  return formData;
};

const MatchManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMatches: builder.query<
      IMatchListResponse,
      { page?: number; limit?: number; type?: string }
    >({
      query: ({ page = 1, limit = 10, type }) => {
        const params = new URLSearchParams();

        params.append("page", String(page));
        params.append("per_page", String(limit));

        if (type && type !== "all") {
          params.append("type", type);
        }

        return {
          url: `/admin/matches?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Match"],
    }),
    getAllPopularArtist: builder.query<
      IPopularArtistListResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search }) => {
        const params = new URLSearchParams();

        params.append("page", String(page));
        params.append("per_page", String(limit));
        if (search) {
          params.append("search", search);
        }

        return {
          url: `/admin/match-voting?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["PopularArtist"],
    }),
    getVotingPublicList: builder.query<IPopularArtistListResponse, void>({
      query: () => {
        return {
          url: `/match-for-voting`,
          method: "GET",
        };
      },
      providesTags: ["PopularArtist"],
    }),
    goVote: builder.mutation<
      IPopularArtistSingleResponse,
      | number
      | {
          matchForVotingId: number;
          playerId?: number;
          voteCount?: number;
        }
    >({
      query: (payload) => {
        const matchForVotingId =
          typeof payload === "number" ? payload : payload.matchForVotingId;
        const playerId =
          typeof payload === "number" ? undefined : payload.playerId;
        const voteCount =
          typeof payload === "number" ? undefined : payload.voteCount;

        return {
          url: `/vote`,
          method: "POST",
          params: {
            match_for_voting_id: matchForVotingId,
            ...(playerId ? { player_id: playerId } : {}),
            ...(voteCount ? { vote_count: voteCount } : {}),
          },
        };
      },
      invalidatesTags: ["PopularArtist"],
    }),
    goVoteForPlayer: builder.mutation<
      any,
      { matchForVotingId: number; playerId: number; voteCount: number }
    >({
      query: (params: {
        matchForVotingId: number;
        playerId: number;
        voteCount: number;
      }) => ({
        url: `/vote-player/${params.matchForVotingId}`,
        method: "POST",
        params: {
          player_id: params.playerId,
          total_vote: params.voteCount,
        },
      }),
      invalidatesTags: ["PopularArtist"],
    }),
    createPopularArtistVote: builder.mutation<
      IPopularArtistSingleResponse,
      ICreatePopularArtistPayload
    >({
      query: (body) => ({
        url: "/admin/match-voting",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PopularArtist"],
    }),
    updatePopularArtistVote: builder.mutation<
      IPopularArtistSingleResponse,
      IUpdatePopularArtistPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/match-voting/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["PopularArtist"],
    }),
    deletePopularArtistVote: builder.mutation<
      IDeletePopularArtistResponse,
      number
    >({
      query: (id) => ({
        url: `/admin/match-voting/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PopularArtist"],
    }),
    getAllPublicMatchList: builder.query<
      IMatchListResponse,
      { page?: number; limit?: number; type?: string }
    >({
      query: ({ page = 1, limit = 10, type }) => {
        const params = new URLSearchParams();

        params.append("page", String(page));
        params.append("per_page", String(limit));

        if (type && type !== "all") {
          params.append("type", type);
        }

        return {
          url: `/matches?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Match"],
    }),
    getSingleMatchByMatchId: builder.query<IMatchDetailsResponse, string | number>({
      query: (id) => ({
        url: `/match/${id}`,
        method: "GET",
      }),
      providesTags: ["Match"],
    }),
    getTwitchStatusLiveCheck: builder.query({
      query: () => ({
        url: `/twitch/check_live`,
        method: "GET",
      }),
    }),
    getSelectedTwoPlayerByMatchId: builder.query({
      query: (id) => ({
        url: `/admin/match-players/${id}`,
        method: "GET",
      }),
      providesTags: ["Match"],
    }),

    createMatch: builder.mutation<IMatchCreateResponse, ICreateMatchPayload>({
      query: (body) => ({
        url: "/admin/matches",
        method: "POST",
        body: buildMatchFormData(body),
        formData: true,
      }),
      invalidatesTags: ["Match"],
    }),
    createMatchConformation: builder.mutation({
      query: ({ id, confirmation_status }) => ({
        url: `/admin/match-confirm/${id}`,
        method: "POST",
        body: {
          confirmation_status,
        },
      }),
      invalidatesTags: ["Match"],
    }),
    selectWinner: builder.mutation({
      query: ({ id, winner_id }) => ({
        url: `/admin/match-winner/${id}`,
        method: "POST",
        body: {
          winner_id,
        },
      }),
      invalidatesTags: ["Match"],
    }),

    updateMatch: builder.mutation<IMatchUpdateResponse, IUpdateMatchPayload>({
      query: ({ id, ...body }) => ({
        url: `/admin/matches/${id}`,
        method: "POST",
        body: buildMatchFormData(body),
        formData: true,
      }),
      invalidatesTags: ["Match"],
    }),

    viewSingleMatch: builder.query<IMatchSingleResponse, number>({
      query: (id) => ({
        url: `/admin/matches/${id}`,
        method: "GET",
      }),
      providesTags: ["Match"],
    }),
    deleteMatch: builder.mutation<IDeleteMatchResponse, number>({
      query: (id) => ({
        url: `/admin/matches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Match"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllMatchesQuery,
  useGetAllPublicMatchListQuery,
  useGetTwitchStatusLiveCheckQuery,
  useGetSingleMatchByMatchIdQuery,
  useGetSelectedTwoPlayerByMatchIdQuery,
  useGetAllPopularArtistQuery,
  useGetVotingPublicListQuery,
  useCreateMatchMutation,
  useCreateMatchConformationMutation,
  useSelectWinnerMutation,
  useUpdateMatchMutation,
  useViewSingleMatchQuery,
  useDeleteMatchMutation,
  useGoVoteMutation,
  useCreatePopularArtistVoteMutation,
  useUpdatePopularArtistVoteMutation,
  useDeletePopularArtistVoteMutation,
  useGoVoteForPlayerMutation,
} = MatchManagementApi;
export default MatchManagementApi;
