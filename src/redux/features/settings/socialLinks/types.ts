export type SocialLinkKey =
  | "instagram"
  | "facebook"
  | "linkedin"
  | "tiktok"
  | "twitch"
  | "telegram"
  | "whatsapp"
  | "youtube";

export type SocialLinksData = Record<SocialLinkKey, string>;

export type SocialLinksResponse = {
  success?: boolean;
  message?: string;
  data?: {
    links?: Partial<SocialLinksData> | null;
  } | Partial<SocialLinksData> | null;
};
