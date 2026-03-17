import { RootState } from "@/redux/store";
import { IAuthUserRole } from "@/types/user/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  token: string | null | false;
  refreshToken: string | null;
  // user: IAuthUser | null;
  role: IAuthUserRole | null;
}

const initialState: AuthState = {
  // user: null,
  token: false,
  role: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      const { token = null, role = null, refreshToken = null } = action.payload;

      state.token = token;
      state.refreshToken = refreshToken;
      state.role = role;

      // clear all old cookies first
      Cookies.remove("token", { path: "/" });
      Cookies.remove("refresh_token", { path: "/" });
      Cookies.remove("role", { path: "/" });

      Cookies.remove("admin_token", { path: "/" });
      Cookies.remove("admin_refresh_token", { path: "/" });
      Cookies.remove("admin_role", { path: "/" });

      if (!token || !role) return;

      if (role === "super_admin") {
        Cookies.set("admin_token", token, {
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          path: "/",
        });

        if (refreshToken) {
          Cookies.set("admin_refresh_token", refreshToken, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            path: "/",
          });
        }

        Cookies.set("admin_role", role, {
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          path: "/",
        });
      } else {
        Cookies.set("token", token, {
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          path: "/",
        });

        if (refreshToken) {
          Cookies.set("refresh_token", refreshToken, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            path: "/",
          });
        }

        Cookies.set("role", role, {
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          path: "/",
        });
      }
    },
    // setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
    //   const { token = null, role = null, refreshToken = null } = action.payload;
    //   state.token = token;
    //   state.refreshToken = refreshToken;
    //   state.role = role;

    //   if (token && role !== "super_admin") {
    //     Cookies.set("token", token, {
    //       secure: process.env.NODE_ENV === "production",
    //       sameSite: "Lax",
    //       path: "/",
    //     });
    //   }
    //   if (token && role === "super_admin") {
    //     Cookies.set("admin_token", token, {
    //       secure: process.env.NODE_ENV === "production",
    //       sameSite: "Lax",
    //       path: "/",
    //     });
    //   }

    //   if (refreshToken && role !== "super_admin") {
    //     Cookies.set("refresh_token", refreshToken, {
    //       secure: process.env.NODE_ENV === "production",
    //       sameSite: "Lax",
    //     });
    //   }
    //   if (refreshToken && role === "super_admin") {
    //     Cookies.set("admin_refresh_token", refreshToken, {
    //       secure: process.env.NODE_ENV === "production",
    //       sameSite: "Lax",
    //     });
    //   }

    //   if (role && role !== "super_admin") {
    //     Cookies.set("role", role, {
    //       secure: process.env.NODE_ENV === "production",
    //       sameSite: "Lax",
    //     });
    //   }
    //   if (role && role === "super_admin") {
    //     Cookies.set("admin_role", role, {
    //       secure: process.env.NODE_ENV === "production",
    //       sameSite: "Lax",
    //     });
    //   }
    // },
    invalidToken: (state) => {
      state.token = state.token + "yyy";
    },
    logOut: (state) => {
      // state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.role = null;
      Cookies.remove("token", { path: "/" });
      Cookies.remove("refresh_token", { path: "/" });
      Cookies.remove("role", { path: "/" });

      Cookies.remove("admin_token", { path: "/" });
      Cookies.remove("admin_refresh_token", { path: "/" });
      Cookies.remove("admin_role", { path: "/" });
    },
    adminLogOut: (state) => {
      // state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.role = null;

      Cookies.remove("admin_token", { path: "/" });
      Cookies.remove("admin_refresh_token", { path: "/" });
      Cookies.remove("admin_role", { path: "/" });

      Cookies.remove("token", { path: "/" });
      Cookies.remove("refresh_token", { path: "/" });
      Cookies.remove("role", { path: "/" });
    },
  },
});

export const { setCredentials, logOut, invalidToken, adminLogOut } =
  authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentRole = (state: RootState) => state.auth.role;

interface SetCredentialsPayload {
  token?: string | null;
  role?: IAuthUserRole | null;
  refreshToken?: string | null;
}
