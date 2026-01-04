import { z } from "zod";

const schema = z.object({
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
});

export const env = schema.parse({
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export const refreshCookieName =
    process.env.REFRESH_COOKIE_NAME ?? "refresh_token";
