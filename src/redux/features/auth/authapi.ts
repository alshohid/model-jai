import { baseApi } from "@/redux/api/baseApi";
import { ApiResponse } from "@/types/common/api";
import {
  IChangeFavoriteGameParams,
  IForgotPasswordParams,
  IForgotPasswordResponseData,
  IResetPasswordParams,
  IAuthRegisterParams,
  IAuthRegisterResponse,
  IGoogleRedirectData,
  ILoginPayload,
  IVerifyLoginOtpParams,
  IVerifyLoginOtpPayload,
  IVerifyForgotPasswordParams,
  IUserInfoResponse,
  IProfileVisibilityResponse,
  IProfileVisibilityParams,
} from "@/types/user/auth";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<IAuthRegisterResponse, IAuthRegisterParams>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
      // invalidatesTags: ["User"],
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
    changeFavoriteGame: builder.mutation<
      ApiResponse<unknown>,
      IChangeFavoriteGameParams
    >({
      query: (body) => ({
        url: "/profile/change-fav-game",
        method: "POST",
        body,
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
    appleLogin: builder.mutation<ApiResponse<IGoogleRedirectData>, void>({
      query: () => ({
        url: "/apple/redirect",
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),

    followArtist: builder.mutation<ApiResponse<IUserInfoResponse>, number>({
      query: (id) => ({
        url: `/follow/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["ManageUser"],
    }),
    unFollowArtist: builder.mutation<ApiResponse<IUserInfoResponse>, number>({
      query: (id) => ({
        url: `/unfollow/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ManageUser"],
    }),
    profileVisibility: builder.mutation<
      ApiResponse<IProfileVisibilityResponse>,
      IProfileVisibilityParams
    >({
      query: (body) => ({
        url: "/profile/visibility",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updateProfileBio: builder.mutation<
      ApiResponse<IUserInfoResponse>,
      { bio: string | null }
    >({
      query: (body) => ({
        url: "/profile/bio",
        method: "PATCH",
        body: { bio: body.bio },
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
    forgotPassword: builder.mutation<
      ApiResponse<IForgotPasswordResponseData>,
      IForgotPasswordParams
    >({
      query: (body) => ({
        url: "/forgot_password",
        method: "POST",
        body,
      }),
    }),
    verifyForgotPassword: builder.mutation<
      ApiResponse<unknown[]>,
      IVerifyForgotPasswordParams
    >({
      query: (body) => ({
        url: "/verify_forgot_password",
        method: "POST",
        body,
      }),
    }),
    verifyLoginOtp: builder.mutation<
      IVerifyLoginOtpPayload,
      IVerifyLoginOtpParams
    >({
      query: (body) => ({
        url: "/verify-login-otp",
        method: "POST",
        body,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          const { handleAuthSuccess } = await import("./authHelpers");
          handleAuthSuccess(data as ILoginPayload, dispatch);
        } catch {}
      },
    }),
    resetPassword: builder.mutation<ApiResponse<unknown>, IResetPasswordParams>(
      {
        query: (body) => ({
          url: "/reset_password",
          method: "POST",
          body,
        }),
      },
    ),
  }),
  overrideExisting: true,
});

export const {
  useRegisterUserMutation,
  useLogoutUserMutation,
  useGoogleLoginMutation,
  useFacebookLoginMutation,
  useGetMeDataQuery,
  useEditProfileMutation,
  useChangeFavoriteGameMutation,
  useFollowArtistMutation,
  useUnFollowArtistMutation,
  useForgotPasswordMutation,
  useVerifyForgotPasswordMutation,
  useVerifyLoginOtpMutation,
  useResetPasswordMutation,
  useAppleLoginMutation,
  useProfileVisibilityMutation,
  useUpdateProfileBioMutation,
} = authApi;
export default authApi;
