/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";
import { ApiResponse } from "@/types/common/api";
import { IMatch } from "@/types/match/MatchManagementTypes";
import {
  ArtistPostsResponse,
  DeleteUserPostResponse,
  ISuspendUserParams,
  IUserCreateParams,
  ReferralUsersResponse,
  SingleUserResponse,
  UpdateUserPostParams,
  User,
  UserManagementResponse,
  UserPostResponse,
  UserPostsResponse,
  UsersResponseForSendMoney,
} from "@/types/user/usermanagement";

const UserManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<
      UserManagementResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: `/admin/users`,
        method: "GET",
        params: params,
      }),
      providesTags: ["ManageUser"],
    }),
    getAllListUserForSendMoney: builder.query<
      UsersResponseForSendMoney,
      { search: string }
    >({
      query: ({ search }) => ({
        url: "/user-list",
        method: "GET",
        params: {
          search: search,
        },
      }),
      providesTags: ["ManageUser"],
    }),
    createUser: builder.mutation<UserManagementResponse, IUserCreateParams>({
      query: (body) => ({
        url: "/admin/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ManageUser"],
    }),
    changeAdminPassword: builder.mutation({
      query: (body: {
        current_password: string;
        password: string;
        password_confirmation: string;
      }) => ({
        url: `/admin/settings/change_password`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["ManageUser"],
    }),
    adminChangeSettings: builder.mutation({
      query: (body: FormData) => ({
        url: `/admin/settings`,
        method: "PUT",
        body,

        formData: true,
      }),
      invalidatesTags: ["User"],
    }),

    getReferralLinkUsedUser: builder.query<
      ReferralUsersResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/referral-link-used",
        method: "GET",
        params: { per_page: limit, page: page },
      }),
      providesTags: ["ManageUser"],
    }),
    searchPlayer: builder.query<any, string>({
      query: (keyword: string) => ({
        url: `/search_artist`,
        method: "GET",
        params: {
          search: keyword,
        },
      }),
      providesTags: ["ManageUser"],
    }),

    updateUser: builder.mutation<
      SingleUserResponse,
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/admin/users/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ManageUser"],
    }),
    viewSingleUser: builder.query<SingleUserResponse, number>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "GET",
      }),
      providesTags: ["ManageUser"],
    }),
    searchUsers: builder.query<
      ApiResponse<User[]>,
      { keyword?: string; role?: string }
    >({
      query: ({ keyword = "", role = "user" }) => ({
        url: `/admin/users/search`,
        method: "GET",
        params: {
          keyword,
          role,
        },
      }),
      providesTags: ["ManageUser"],
    }),
    getAllPlayer: builder.query<any, void>({
      query: () => ({
        url: `/admin/all-players`,
        method: "GET",
      }),
      providesTags: ["ManageUser"],
    }),
    viewSingleArtistProfile: builder.query<any, number>({
      query: (id) => ({
        url: `/show_artist_prifile/${id}`,
        method: "GET",
      }),
      providesTags: ["ManageUser"],
    }),
    getTotalUserCount: builder.query<any, void>({
      query: () => ({
        url: `/admin/users/count/total`,
        method: "GET",
      }),
      providesTags: ["ManageUser"],
    }),
    changeUserRole: builder.mutation<ApiResponse<User>, { id: number }>({
      query: ({ id }) => ({
        url: `/admin/users/change_role/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["ManageUser"],
    }),

    suspendUser: builder.mutation<
      ApiResponse<UserManagementResponse>,
      { id: number } & ISuspendUserParams
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/users/suspend/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ManageUser"],
    }),
    unSuspendUser: builder.mutation<
      ApiResponse<UserManagementResponse>,
      { id: number; notify_email: boolean }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/users/unsuspend/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ManageUser"],
    }),
    getAllUserPosts: builder.query<UserPostsResponse, void>({
      query: () => ({
        url: `/posts`,
        method: "GET",
      }),
      providesTags: ["UserPost"],
    }),
    showArtistPostById: builder.query<ArtistPostsResponse, number>({
      query: (id) => ({
        url: `/show_artist_posts/${id}`,
        method: "GET",
      }),
      providesTags: ["UserPost"],
    }),
    createUserPost: builder.mutation<UserPostResponse, FormData>({
      query: (body) => ({
        url: `/posts`,
        method: "POST",
        body,
        formData: true,
      }),
      invalidatesTags: ["UserPost", "User"],
    }),
    startAdminVoting: builder.mutation<
      ApiResponse<{ matchData?: IMatch }>,
      number
    >({
      query: (id) => ({
        url: `/admin/start-vote/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Match", "PopularArtist"],
    }),
    updateUserPost: builder.mutation<UserPostResponse, UpdateUserPostParams>({
      query: ({ id, body }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body,
        formData: true,
      }),
      invalidatesTags: ["UserPost", "User"],
    }),
    deleteUserPost: builder.mutation<DeleteUserPostResponse, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserPost", "User"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useViewSingleUserQuery,
  useSuspendUserMutation,
  useUnSuspendUserMutation,
  useSearchUsersQuery,
  useChangeUserRoleMutation,
  useGetAllPlayerQuery,
  useChangeAdminPasswordMutation,
  useAdminChangeSettingsMutation,
  useSearchPlayerQuery,
  useViewSingleArtistProfileQuery,
  useGetReferralLinkUsedUserQuery,
  useGetAllListUserForSendMoneyQuery,
  useGetAllUserPostsQuery,
  useCreateUserPostMutation,
  useUpdateUserPostMutation,
  useDeleteUserPostMutation,
  useShowArtistPostByIdQuery,
  useGetTotalUserCountQuery,
  useStartAdminVotingMutation,
} = UserManagementApi;
export default UserManagementApi;
