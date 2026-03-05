import { baseApi } from "@/redux/api/baseApi";

import {
  IGameCategoryCreateParams,
  IGameCategoryResponse,
} from "@/types/game/gamecategory/gameCategorytypes";

const GameCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllGameCategories: builder.query<
      IGameCategoryResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/categories?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["GameCategory"],
    }),
    createGameCategory: builder.mutation<
      IGameCategoryResponse,
      IGameCategoryCreateParams
    >({
      query: (body) => ({
        url: "/admin/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["GameCategory"],
    }),

    updateGameCategory: builder.mutation<
      IGameCategoryResponse,
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/admin/categories/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["GameCategory"],
    }),

    viewSingleGameCategory: builder.query<IGameCategoryResponse, number>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "GET",
      }),
      providesTags: ["GameCategory"],
    }),
    deleteGameCategory: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GameCategory"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllGameCategoriesQuery,
  useCreateGameCategoryMutation,
  useUpdateGameCategoryMutation,
  useViewSingleGameCategoryQuery,
  useDeleteGameCategoryMutation,
} = GameCategoryApi;
export default GameCategoryApi;
