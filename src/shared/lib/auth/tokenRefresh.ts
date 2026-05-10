import constants from "@/constant";
import { IRefreshTokenPayload } from "@/types/user/auth";

export const extractRefreshTokens = (payload: Partial<IRefreshTokenPayload>) => {
  const accessToken =
    payload?.data?.access_token ?? payload?.authorization?.access_token ?? null;
  const refreshToken =
    payload?.data?.refresh_token ??
    payload?.authorization?.refresh_token ??
    accessToken ??
    null;

  return { accessToken, refreshToken };
};

const decodeBase64Url = (value: string) => {
  const normalized = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");

  if (typeof globalThis.atob === "function") {
    return globalThis.atob(normalized);
  }

  throw new Error("Base64 decoder is not available");
};

export const getTokenExpiryTime = (token?: string | null) => {
  if (!token) return null;

  try {
    const [, payloadSegment] = token.split(".");
    if (!payloadSegment) {
      return null;
    }

    const payload = JSON.parse(decodeBase64Url(payloadSegment)) as {
      exp?: number;
    };

    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

export const requestTokenRefresh = async (refreshCredential: string) => {
  const response = await fetch(`${constants.baseApiURL}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      access_token: refreshCredential,
    }),
    cache: "no-store",
  });

  const payload = (await response
    .json()
    .catch(() => null)) as (IRefreshTokenPayload & { message?: string }) | null;

  if (!response.ok) {
    throw new Error(payload?.message || "Refresh failed");
  }

  const { accessToken, refreshToken } = extractRefreshTokens(payload ?? {});

  if (!accessToken) {
    throw new Error("No access token in refresh response");
  }

  return { accessToken, refreshToken };
};
