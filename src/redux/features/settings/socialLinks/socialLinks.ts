/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/redux/api/baseApi";
import type { SocialLinkKey, SocialLinksData } from "./types";

export const SOCIAL_LINK_KEYS: SocialLinkKey[] = [
  "instagram",
  "facebook",
  "linkedin",
  "tiktok",
  "twitch",
  "telegram",
  "whatsapp",
  "youtube",
];

export const SOCIAL_LINK_LABELS: Record<SocialLinkKey, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  twitch: "Twitch",
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  youtube: "YouTube",
};

export const emptySocialLinks = (): SocialLinksData => ({
  instagram: "",
  facebook: "",
  linkedin: "",
  tiktok: "",
  twitch: "",
  telegram: "",
  whatsapp: "",
  youtube: "",
});

export const normalizeSocialLinks = (
  data?: Partial<SocialLinksData> | null,
): SocialLinksData => {
  const normalized = emptySocialLinks();

  if (!data) return normalized;

  for (const key of SOCIAL_LINK_KEYS) {
    const value = data[key];
    normalized[key] = typeof value === "string" ? value : "";
  }

  return normalized;
};

const extractSocialLinksPayload = (response: any): Partial<SocialLinksData> | null => {
  const payload = response?.data ?? response;

  if (!payload || typeof payload !== "object") {
    return null;
  }

  if (payload.links && typeof payload.links === "object") {
    return payload.links;
  }

  return payload;
};

export const socialLinksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminSocialLinks: builder.query<SocialLinksData, void>({
      query: () => ({
        url: "/admin/settings/social_links",
        method: "GET",
      }),
      providesTags: ["SocialLinks"],
      transformResponse: (response: any) => {
        return normalizeSocialLinks(extractSocialLinksPayload(response));
      },
    }),

    getPublicSocialLinks: builder.query<SocialLinksData, void>({
      query: () => ({
        url: "/social-links",
        method: "GET",
      }),
      providesTags: ["SocialLinks"],
      transformResponse: (response: any) => {
        return normalizeSocialLinks(extractSocialLinksPayload(response));
      },
    }),

    updateAdminSocialLinks: builder.mutation<any, SocialLinksData>({
      query: (body) => ({
        url: "/admin/settings/social_links",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["SocialLinks"],
    }),
  }),
});

export const {
  useGetAdminSocialLinksQuery,
  useGetPublicSocialLinksQuery,
  useUpdateAdminSocialLinksMutation,
} = socialLinksApi;
