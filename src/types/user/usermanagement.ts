/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "@/types/common/api";
export interface UserManagementResponse {
  success: boolean;
  message: string;
  data: User[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export interface User {
  game: any;
  game_id?: number | null;
  id: number;
  name: string;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  email: string;
  image?: string | null;
  provider?: string;
  verifiedAt: boolean;
  role: "user" | "artist" | "super_admin";
  referral_no: string;
  createdAt: string;
  suspended_until: string | null;
  is_permanent_suspended: boolean;
  phone_number?: string | null;
  nationality?: string | null;
  social_verification_status?: boolean | number | null;
  followers_count?: number;
  following_count?: number;
  total_post?: number;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  address?: string | null;
  isVerified?: boolean;
  artist_name?: string | null;
}

export interface PaginationMeta {
  currentPage: number;
  from: number;
  lastPage: number;
  links: PaginationLink[];
  path: string;
  perPage: number;
  to: number;
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

export interface PaginationLink {
  url?: string;
  label: string;
  page?: number;
  active: boolean;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}
export interface IUserCreateParams {
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  name: string;
  email: string;
  password: string;
  state?: string | null;
  zip_code?: string | null;
  address?: string | null;
  role?: "user" | "super_admin" | "artist";
}

export interface ISuspendUserParams {
  id: number;
  reason_category: string;
  note?: string;
  notify_email: boolean;
  duration?: string;
}
export interface SingleUserResponse {
  success: boolean;
  message: string;
  data: User;
}
export type ReferralUser = {
  rank_no: string;
  user_name: string;
  range_points: (string | number)[];
};

export type ReferralUsersResponse = {
  status: boolean;
  message: string;
  data: ReferralUser[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev: boolean;
    next: boolean;
  };
};
export interface IUserForSendMoney {
  id: number;
  name: string;
  email: string;
  image_url: string | null;
}

export interface UsersResponseForSendMoney {
  status: boolean;
  message: string;
  data: IUserForSendMoney[];
}

export interface UserPost {
  id: number;
  image: string;
  description: string;
  user_id?: number;
  created_at: string;
  updated_at?: string;
}

export type UserPostsResponse = ApiResponse<UserPost[]>;
export type UserPostResponse = ApiResponse<UserPost>;
export type DeleteUserPostResponse = ApiResponse<null>;
export type ArtistPostsResponse = ApiResponse<{
  posts: UserPost[];
}>;

export interface UpdateUserPostParams {
  id: number;
  body: FormData;
}
