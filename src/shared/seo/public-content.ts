import constants from "@/constant";
import type {
  IMatch,
  IMatchDetailsResponse,
  IMatchListResponse,
} from "@/types/match/MatchManagementTypes";
import type { INews, INewsListResponse } from "@/types/settings/news/newsManagementTypes";
import type {
  IGameCategoryData,
  IGameCategoryResponse,
} from "@/types/game/gamecategory/gameCategorytypes";
import type { UserPost } from "@/types/user/usermanagement";

const SEO_REVALIDATE_SECONDS = 900;
const apiBaseUrl = `${constants.baseApiURL.replace(/\/+$/, "")}/`;

export type PublicArtistProfileResponse = {
  status?: boolean;
  message?: string;
  data?: {
    user?: {
      id?: number;
      name?: string;
      email?: string;
      image?: string | null;
      note?: string | null;
      role?: string;
      verified_at?: string | null;
      followers_count?: number | string | null;
      following_count?: number | string | null;
      total_post?: number | string | null;
      phone_number?: string | null;
      nationality?: string | null;
    };
    is_followed?: boolean;
    total_earning?: number | string | null;
    total_referral_earning?: number | string | null;
    total_tip_received?: number | string | null;
  };
};

export type PublicArtistPostsResponse = {
  status?: boolean;
  message?: string;
  data?: {
    posts?: UserPost[];
  };
};

const fetchSeoJson = async <T>(path: string): Promise<T | null> => {
  try {
    const response = await fetch(new URL(path.replace(/^\/+/, ""), apiBaseUrl), {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: SEO_REVALIDATE_SECONDS,
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
};

export const getPublicMatches = async (limit = 6): Promise<IMatch[]> => {
  const response = await fetchSeoJson<IMatchListResponse>(
    `matches?page=1&per_page=${limit}`,
  );

  return response?.data ?? [];
};

export const getPublicMatchById = async (
  matchId: string | number,
): Promise<IMatchDetailsResponse | null> =>
  fetchSeoJson<IMatchDetailsResponse>(`match/${matchId}`);

export const getFeaturedNews = async (limit = 4): Promise<INews[]> => {
  const response = await fetchSeoJson<INewsListResponse>(
    `get_featured_news?page=1&per_page=${limit}`,
  );

  return response?.data ?? [];
};

export const getPublicCategories = async (
  limit = 8,
): Promise<IGameCategoryData[]> => {
  const response = await fetchSeoJson<IGameCategoryResponse>(
    `categories?page=1&per_page=${limit}`,
  );

  return response?.data ?? [];
};

export const getPublicArtistProfileById = async (
  artistId: string | number,
): Promise<PublicArtistProfileResponse | null> =>
  fetchSeoJson<PublicArtistProfileResponse>(`show_artist_prifile/${artistId}`);

export const getHomeSeoContent = async () => {
  const [matches, newsItems, categories] = await Promise.all([
    getPublicMatches(6),
    getFeaturedNews(4),
    getPublicCategories(8),
  ]);

  return {
    matches,
    newsItems,
    categories,
  };
};
