import { baseApi } from "@/redux/api/baseApi";
import { ApiResponse } from "@/types/common/api";
import {
  IAuthRegisterParams,
  IAuthRegisterResponse,
  IGoogleRedirectData,
} from "@/types/user/auth";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<IAuthRegisterResponse, IAuthRegisterParams>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    //google login
    googleLogin: builder.mutation<ApiResponse<IGoogleRedirectData>, void>({
      query: () => ({
        url: "/google/redirect",
        method: "GET",
      }),
    }),
    //facebook login
    facebookLogin: builder.mutation<ApiResponse<IGoogleRedirectData>, void>({
      query: () => ({
        url: "/facebook/redirect",
        method: "GET",
      }),
    }),
    // verifyEmail: builder.mutation<
    //   IAuthRegisterResponse,
    //   IAuthVerifyEmailParams
    // >({
    //   query: (body) => ({
    //     url: "/auth/verify-email",
    //     method: "POST",
    //     body,
    //   }),
    // }),
    // getMe: builder.query<IAuthUser, void>({
    //   query: () => `/auth/me`,
    //   providesTags: ["Me"] as const,
    //   transformResponse: (response: WithStatus<IAuthUser>) => response.data,
    // }),
    // changePassword: builder.mutation<
    //   WithStatus<void>,
    //   IAuthChangePasswordParams
    // >({
    //   query: (body) => ({
    //     url: "/auth/change-password",
    //     method: "POST",
    //     body,
    //   }),
    // }),
    // updateAuthUser: builder.mutation<
    //   IAuthRegisterResponse,
    //   IAuthUpdateUserParams
    // >({
    //   query: (body) => {
    //     const formData = new FormData();

    //     if (body.name) {
    //       formData.append("name", body.name);
    //     }

    //     if (body.avatar) {
    //       formData.append("avatar", body.avatar);
    //     }

    //     return {
    //       url: "/auth/update",
    //       method: "PATCH",
    //       body: formData,
    //     };
    //   },
    //   invalidatesTags: ["Me"],
    // }),
  }),
  overrideExisting: false,
});

export const {
  //   useGetMeQuery,
  useRegisterUserMutation,
  useLogoutUserMutation,
  useGoogleLoginMutation,
  useFacebookLoginMutation,

  //   useChangePasswordMutation,
} = authApi;
export default authApi;
