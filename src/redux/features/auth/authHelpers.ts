import { IAuthUserRole, ILoginPayload } from "@/types/user/auth";
import { AppDispatch } from "../../store";
import { setCredentials } from "./authSlice";

const toAuthRole = (role?: string | null): IAuthUserRole => {
  if (role === "superadmin" || role === "user" || role === "artist")
    return role;
  return null;
};

export const extractLoginAuthData = (payload: ILoginPayload) => {
  const accessToken = payload?.data?.access_token ?? null;
  const refreshToken =
    payload?.data?.refresh_token ?? payload?.data?.access_token ?? null;
  const role = toAuthRole(payload?.data?.user?.role ?? null);

  return { accessToken, refreshToken, role };
};

export const handleAuthSuccess = (
  payload: ILoginPayload,
  dispatch: AppDispatch,
) => {
  const { accessToken, refreshToken, role } = extractLoginAuthData(payload);

  dispatch(
    setCredentials({
      token: accessToken,
      refreshToken,
      role,
    }),
  );
};
