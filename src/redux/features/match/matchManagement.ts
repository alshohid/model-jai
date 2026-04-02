import { baseApi } from "@/redux/api/baseApi";
import {
  ICreateMatchPayload,
  IDeleteMatchResponse,
  IMatchCreateResponse,
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
        const playerId = typeof payload === "number" ? undefined : payload.playerId;
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
    getSingleMatchByMatchId: builder.query({
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
        body,
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
        body,
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
} = MatchManagementApi;
export default MatchManagementApi;
