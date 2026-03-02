import { baseApi } from "@/redux/api/baseApi";
import { ApiResponse } from "@/types/common/api";
import {
  IAuthRegisterParams,
  IAuthRegisterResponse,
  IGoogleRedirectData,
  IUserInfoResponse,
} from "@/types/user/auth";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<IAuthRegisterResponse, IAuthRegisterParams>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    editProfile: builder.mutation<ApiResponse<IUserInfoResponse>, FormData>({
      query: (formData) => ({
        url: "/profile/update",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    googleLogin: builder.mutation<ApiResponse<IGoogleRedirectData>, void>({
      query: () => ({
        url: "/google/redirect",
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),

    facebookLogin: builder.mutation<ApiResponse<IGoogleRedirectData>, void>({
      query: () => ({
        url: "/facebook/redirect",
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),
    getMeData: builder.query<ApiResponse<IUserInfoResponse>, void>({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterUserMutation,
  useLogoutUserMutation,
  useGoogleLoginMutation,
  useFacebookLoginMutation,
  useGetMeDataQuery,
  useEditProfileMutation,
} = authApi;
export default authApi;
