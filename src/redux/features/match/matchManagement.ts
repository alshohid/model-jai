import { baseApi } from "@/redux/api/baseApi";

import {
  IGameCategoryCreateParams,
  IGameCategoryResponse,
} from "@/types/game/gamecategory/gameCategorytypes";

const MatchManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMatches: builder.query<
      IGameCategoryResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/matches?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Match"],
    }),

    createMatch: builder.mutation<
      IGameCategoryResponse,
      IGameCategoryCreateParams
    >({
      query: (body) => ({
        url: "/admin/matches",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Match"],
    }),

    updateMatch: builder.mutation<
      IGameCategoryResponse,
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/admin/matches/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Match"],
    }),

    viewSingleMatch: builder.query<IGameCategoryResponse, number>({
      query: (id) => ({
        url: `/admin/matches/${id}`,
        method: "GET",
      }),
      providesTags: ["Match"],
    }),
    deleteMatch: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/admin/matches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Match"],
    }),
  }),
  overrideExisting: true,
});

export const {} = MatchManagementApi;
export default MatchManagementApi;
