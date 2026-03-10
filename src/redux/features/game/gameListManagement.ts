/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";
import {
  IGameCreateParams,
  IGameCreateResponse,
  IGameListResponse,
} from "@/types/game/gameList/gameListTypes";

const GameListManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllGameList: builder.query<
      IGameListResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/games?page=${page}&per_page=${limit}`,
        method: "GET",
      }),
      providesTags: ["GameList"],
    }),
    getAllPublicGamesList: builder.query<
      IGameListResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 100 }) => ({
        url: `/games?page=${page}&per_page=${limit}`,
        method: "GET",
      }),
      providesTags: ["GameList"],
    }),
    createGameList: builder.mutation<IGameCreateResponse, IGameCreateParams>({
      query: (body) => ({
        url: "/admin/games",
        method: "POST",
        body,
      }),
      invalidatesTags: ["GameList"],
    }),
    getAllGames: builder.query<any, void>({
      query: () => ({
        url: `/admin/all-games`,
        method: "GET",
      }),
      providesTags: ["GameList"],
    }),
    updateGameList: builder.mutation<
      IGameCreateResponse,
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/admin/games/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["GameList"],
    }),

    viewSingleGameList: builder.query<IGameListResponse, number>({
      query: (id) => ({
        url: `/admin/games/${id}`,
        method: "GET",
      }),
      providesTags: ["GameList"],
    }),
    deleteGameList: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/admin/games/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GameList"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateGameListMutation,
  useGetAllGameListQuery,
  useGetAllPublicGamesListQuery,
  useUpdateGameListMutation,
  useDeleteGameListMutation,
  useViewSingleGameListQuery,
  useGetAllGamesQuery,
} = GameListManagementApi;
export default GameListManagementApi;
