import { baseApi } from "@/redux/api/baseApi";
import {
  IGalleryCreateResponse,
  IGalleryListResponse,
  IGallerySingleResponse,
  IGalleryUpdateResponse,
  IDeleteGalleryResponse,
} from "@/types/settings/gallery/galleryManagementTypes";

const GalleryManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllGalleryList: builder.query<
      IGalleryListResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/galleries?page=${page}&per_page=${limit}`,
        method: "GET",
      }),
      providesTags: ["Gallery"],
    }),
    getFeaturedGalleryList: builder.query<
      IGalleryListResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 }) => ({
        url: `/get_featured_gallery?page=${page}&per_page=${limit}`,
        method: "GET",
      }),
      providesTags: ["Gallery"],
    }),

    viewSingleGallery: builder.query<IGallerySingleResponse, number>({
      query: (id) => ({
        url: `/admin/galleries/${id}`,
        method: "GET",
      }),
      providesTags: ["Gallery"],
    }),

    createGallery: builder.mutation<IGalleryCreateResponse, FormData>({
      query: (body) => ({
        url: "/admin/galleries",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Gallery"],
    }),

    updateGallery: builder.mutation<
      IGalleryUpdateResponse,
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/admin/galleries/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Gallery"],
    }),

    deleteGallery: builder.mutation<IDeleteGalleryResponse, number>({
      query: (id) => ({
        url: `/admin/galleries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Gallery"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetAllGalleryListQuery,
  useGetFeaturedGalleryListQuery,
  useViewSingleGalleryQuery,
  useCreateGalleryMutation,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation,
} = GalleryManagementApi;

export default GalleryManagementApi;
