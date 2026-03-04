import { baseApi } from "@/redux/api/baseApi";
import { ApiResponse } from "@/types/common/api";
import {
  ISuspendUserParams,
  IUserCreateParams,
  UserManagementResponse,
} from "@/types/user/usermanagement";

const UserManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<UserManagementResponse, { page?: number }>({
      query: ({ page = 1 }) => ({
        url: `/admin/users?page=${page}`,
        method: "GET",
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

    updateUser: builder.mutation<
      ApiResponse<UserManagementResponse>,
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["ManageUser"],
    }),
    viewSingleUser: builder.query<UserManagementResponse, number>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "GET",
      }),
      providesTags: ["ManageUser"],
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
} = UserManagementApi;
export default UserManagementApi;
