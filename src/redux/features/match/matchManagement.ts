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
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/matches?page=${page}&limit=${limit}`,
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
  useGetSelectedTwoPlayerByMatchIdQuery,
  useCreateMatchMutation,
  useCreateMatchConformationMutation,
  useUpdateMatchMutation,
  useViewSingleMatchQuery,
  useDeleteMatchMutation,
} = MatchManagementApi;
export default MatchManagementApi;
