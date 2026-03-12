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
  useGetSingleMatchByMatchIdQuery,
  useGetSelectedTwoPlayerByMatchIdQuery,
  useCreateMatchMutation,
  useCreateMatchConformationMutation,
  useSelectWinnerMutation,
  useUpdateMatchMutation,
  useViewSingleMatchQuery,
  useDeleteMatchMutation,
} = MatchManagementApi;
export default MatchManagementApi;
