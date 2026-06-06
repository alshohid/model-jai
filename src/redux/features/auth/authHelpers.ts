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

type AuthDataLike = {
  access_token?: string;
  refresh_token?: string;
  email?: string | null;
  user?: {
    role?: string | null;
    email?: string | null;
  } | null;
};

type AuthPayloadLike = {
  data?: AuthDataLike;
  authorization?: Pick<AuthDataLike, "access_token" | "refresh_token">;
  access_token?: string;
  refresh_token?: string;
  email?: string | null;
  user?: AuthDataLike["user"];
};

export const extractLoginAuthData = (
  payload: ILoginPayload | IVerifyLoginOtpPayload,
) => {
  const authPayload = payload as AuthPayloadLike;
  const data = authPayload?.data;
  const authorization = authPayload?.authorization;
  const accessToken =
    data?.access_token ??
    authorization?.access_token ??
    authPayload?.access_token ??
    null;
  const refreshToken =
    data?.refresh_token ??
    authorization?.refresh_token ??
    authPayload?.refresh_token ??
    accessToken;
  const role = toAuthRole(data?.user?.role ?? authPayload?.user?.role ?? null);
  const email =
    data?.email?.trim() ??
    data?.user?.email?.trim() ??
    authPayload?.email?.trim() ??
    authPayload?.user?.email?.trim() ??
    "";

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
