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

            if (token) {
                Cookies.set("token", token, {
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "Lax",
                });
            }

            if (refreshToken) {
                Cookies.set("refresh_token", refreshToken, {
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "Lax",
                });
            }

            if (role) {
                Cookies.set("role", role, {
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "Lax",
                });
            }
        },
        invalidToken: (state) => {
            state.token = state.token + 'yyy'
        },
        logOut: (state) => {
            // state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.role = null;

            Cookies.remove("token");
            Cookies.remove("refresh_token");
            Cookies.remove("role");
        },
    },
});

export const { setCredentials, logOut, invalidToken } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentRole = (state: RootState) => state.auth.role;

interface SetCredentialsPayload {
    token?: string | null;
    role?: IAuthUserRole | null;
    refreshToken?: string | null;
}
