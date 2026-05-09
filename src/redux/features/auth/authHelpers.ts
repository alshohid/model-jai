import {
  IAuthUserRole,
  ILoginPayload,
  IVerifyLoginOtpPayload,
} from "@/types/user/auth";
import { AppDispatch } from "../../store";
import { setCredentials } from "./authSlice";

const toAuthRole = (role?: string | null): IAuthUserRole => {
  if (role === "super_admin" || role === "user" || role === "artist")
    return role;
  return null;
};

export const extractLoginAuthData = (payload: ILoginPayload) => {
  const accessToken = payload?.data?.access_token ?? null;
  const refreshToken =
    payload?.data?.refresh_token ?? payload?.data?.access_token ?? null;
  const role = toAuthRole(payload?.data?.user?.role ?? null);
  const email = payload?.data?.email?.trim() ?? "";

  return { accessToken, refreshToken, role, email };
};

export const handleAuthSuccess = (
  payload: ILoginPayload | IVerifyLoginOtpPayload,
  dispatch: AppDispatch,
) => {
  const { accessToken, refreshToken, role } = extractLoginAuthData(payload);

  if (!accessToken || !role) {
    return false;
  }

  dispatch(
    setCredentials({
      token: accessToken,
      refreshToken,
      role,
    }),
  );

  return true;
};

export type LoginFlowResult =
  | { kind: "authenticated"; role: IAuthUserRole }
  | { kind: "otp"; email: string }
  | { kind: "unknown" };

export const resolveLoginFlowResult = (
  payload: ILoginPayload,
): LoginFlowResult => {
  const { accessToken, role, email } = extractLoginAuthData(payload);

  if (accessToken && role) {
    return {
      kind: "authenticated",
      role,
    };
  }

  if (email) {
    return {
      kind: "otp",
      email,
    };
  }

  return {
    kind: "unknown",
  };
};
