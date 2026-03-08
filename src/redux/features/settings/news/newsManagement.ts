import { baseApi } from "@/redux/api/baseApi";
import {
  INewsCreateResponse,
  INewsListResponse,
  INewsSingleResponse,
  INewsUpdateResponse,
  IDeleteNewsResponse,
} from "@/types/settings/news/newsManagementTypes";

const NewsManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNewsList: builder.query<
      INewsListResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/news?page=${page}&per_page=${limit}`,
        method: "GET",
      }),
      providesTags: ["News"],
    }),

    viewSingleNews: builder.query<INewsSingleResponse, number>({
      query: (id) => ({
        url: `/admin/news/${id}`,
        method: "GET",
      }),
      providesTags: ["News"],
    }),

    createNews: builder.mutation<INewsCreateResponse, FormData>({
      query: (body) => ({
        url: "/admin/news",
        method: "POST",
        body,
      }),
      invalidatesTags: ["News"],
    }),

    updateNews: builder.mutation<
      INewsUpdateResponse,
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/admin/news/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["News"],
    }),

    deleteNews: builder.mutation<IDeleteNewsResponse, number>({
      query: (id) => ({
        url: `/admin/news/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["News"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetAllNewsListQuery,
  useViewSingleNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = NewsManagementApi;

export default NewsManagementApi;
