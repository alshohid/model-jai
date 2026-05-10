import constants from "@/constant";
import { IRefreshTokenPayload } from "@/types/user/auth";

export type TokenRefreshSource = "proactive" | "401-fallback";

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

const isDevRefreshLoggingEnabled = process.env.NODE_ENV !== "production";

const getTokenDebugPreview = (token?: string | null) => {
  if (!token) return "none";
  return `${token.slice(0, 10)}...${token.slice(-6)}`;
};

export const logTokenRefreshDebug = (
  stage:
    | "scheduled"
    | "start"
    | "success"
    | "fail"
    | "retry-scheduled"
    | "skip",
  details: Record<string, unknown>,
) => {
  if (!isDevRefreshLoggingEnabled) {
    return;
  }

  console.debug(`[auth:refresh] ${stage}`, details);
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

export const requestTokenRefresh = async (
  refreshCredential: string,
  options: {
    source: TokenRefreshSource;
    reason?: string;
  },
) => {
  logTokenRefreshDebug("start", {
    source: options.source,
    reason: options.reason ?? null,
    tokenPreview: getTokenDebugPreview(refreshCredential),
  });

  try {
    const response = await fetch(`${constants.baseApiURL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshCredential}`,
      },
      body: JSON.stringify({
        token: refreshCredential,
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

    logTokenRefreshDebug("success", {
      source: options.source,
      reason: options.reason ?? null,
      nextTokenPreview: getTokenDebugPreview(accessToken),
      hasSeparateRefreshToken: Boolean(
        refreshToken && refreshToken !== accessToken,
      ),
      expiresAt: getTokenExpiryTime(accessToken),
    });

    return { accessToken, refreshToken };
  } catch (error) {
    logTokenRefreshDebug("fail", {
      source: options.source,
      reason: options.reason ?? null,
      message: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};
