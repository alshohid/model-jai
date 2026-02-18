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

    googleLogin: builder.mutation<ApiResponse<IGoogleRedirectData>, void>({
      query: () => ({
        url: "/google/redirect",
        method: "GET",
      }),
    }),

    facebookLogin: builder.mutation<ApiResponse<IGoogleRedirectData>, void>({
      query: () => ({
        url: "/facebook/redirect",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterUserMutation,
  useLogoutUserMutation,
  useGoogleLoginMutation,
  useFacebookLoginMutation,
} = authApi;
export default authApi;
