import { ApiResponse } from "../common/api";

export type IRefreshTokenPayload = {
  success: boolean;
  data?: {
    access_token?: string;
    refresh_token?: string;
  };
  authorization?: {
    type?: string;
    access_token?: string;
    refresh_token?: string;
  };
};

export interface ILoginParams {
  email: string;
  password: string;
}

export interface IVerifyLoginOtpParams {
  email: string;
  otp: string;
}

export type IAuthUserRole = "user" | "super_admin" | "artist" | null;
export const RoleUtils = {
  isAdmin: (role?: IAuthUserRole | null) => role === "super_admin",
  isUser: (role?: IAuthUserRole | null) => role === "user",
  isPublic: (role?: IAuthUserRole | null) => role == null,

  hasRole: (
    role: IAuthUserRole | null | undefined,
    allowedRoles: IAuthUserRole[],
  ): boolean => {
    if (!role) return false;
    return allowedRoles.includes(role);
  },
};

export interface ILoginChallengeData {
  email?: string;
}

export type IAuthSessionData = ILoginChallengeData & {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  user?: IUser;
};

export type ILoginPayload = ApiResponse<IAuthSessionData>;
export type IVerifyLoginOtpPayload = ApiResponse<IAuthSessionData>;
export interface IAuthUser {
  id: number;
  name: string;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  email: string;
  image: string | null;
  provider: string | null;
  verified_at: boolean;
  suspended_until: string | null;
  is_permanent_suspended: boolean | null;
  suspension_reason: string | null;
  note: string | null;
  role: "user" | "super_admin" | "artist";
  referral_no: string;
  created_at: string;
}

export type IAuthUpdateUserParams = Omit<Partial<IAuthUser>, "avatar"> & {
  avatar?: File;
};

export interface IAuthRegisterParams {
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  artist_name: string;
  email: string;
  password: string;
  c_password: string;
  address?: string | null;
  city?: string | null;
  zip_code?: string | null;
  state?: string | null;
  social_verification_status?: boolean;
  social_verification_number?: string | null;
  game_id?: number | null;
  referral_id?: string | null;
}

export interface IAuthRegisterResponse {
  success: boolean;
  message: string;
  data: IAuthUser;
}

export interface IForgotPasswordParams {
  email: string;
}

export interface IForgotPasswordResponseData {
  token: string;
  email: string;
}

export interface IVerifyForgotPasswordParams {
  email: string;
  otp: string;
}

export interface IResetPasswordParams {
  email: string;
  token: string;
  otp: string;
  new_password: string;
  confirm_new_password: string;
}

export interface IAuthVerifyEmailParams {
  email: string;
  token: string;
}

export interface IAuthChangePasswordParams {
  old_password: string;
  new_password: string;
}
export interface IGoogleRedirectData {
  url: string;
}
export interface IUserStats {
  total_earning: string;
  total_referral_earning: string;
  total_tip_received: string;
  total_withdraw: string;
  total_balance: number;
  total_bet: string;
}
export interface IUserFavoriteGame {
  id: number;
  name: string;
  image: string | null;
}
export interface IUser {
  game: IUserFavoriteGame | null;
  id: number;
  name: string;
  is_challenger?: boolean;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  email: string;
  challenge_total_count: number;
  challenge_wins_count: number;
  challenge_losses_count: number;
  phone_number: string | null;
  nationality: string | null;
  image: string | null;
  provider?: string;
  verified_at: boolean;
  suspended_until: string | null;
  is_permanent_suspended: boolean;
  suspension_reason: string | null;
  note: string | null;
  total_post: number;
  role: "user" | "super_admin" | "artist" | string;
  referral_no: string;
  followers_count: number;
  following_count: number;
  created_at: string;
  total_balance: number;
  artist_name?: string | null;
  city?: string | null;
  bio?: string | null;
  show_email: boolean;
  show_name: boolean;
  show_total_earning: boolean;
  show_total_referral_earning: boolean;
  show_total_tip_received: boolean;
  show_total_withdraw: boolean;
}
export interface IUserInfoResponse {
  user: IUser;
  // is_challenger: boolean;
  total_earning: string;
  total_referral_earning: string;
  total_tip_received: string;
  total_withdraw: string;
  total_balance: number;
  total_bet: string;
}
export interface IUpdateUserParams {
  name?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string | null;
  nationality?: string | null;
  image?: File | string | null | undefined;
}

export interface IChangeFavoriteGameParams {
  game_id: number;
}
export interface IProfileVisibilityParams {
  show_email: boolean;
  show_name: boolean;
  show_total_earning: boolean;
  show_total_referral_earning: boolean;
  show_total_tip_received: boolean;
  show_total_withdraw: boolean;
}

export interface IProfileVisibilityResponse {
  id: number;
  name: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  artist_name: string;
  email: string;

  show_email: boolean;
  show_name: boolean;
  show_total_earning: boolean;
  show_total_referral_earning: boolean;
  show_total_tip_received: boolean;
  show_total_withdraw: boolean;

  show_total_balance: boolean;
  show_total_bet: boolean;

  phone_number: string | null;
  nationality: string | null;
  address: string | null;
  city: string | null;
  zip_code: string | null;
  state: string | null;

  social_verification_status: boolean;
  social_verification_number: string | null;

  is_player: boolean;
  image: string;
  provider: string;
  verified_at: boolean;

  suspended_until: string | null;
  is_permanent_suspended: boolean;
  suspension_reason: string | null;
  note: string | null;

  total_post: number;
  role: string;
  referral_no: string;

  game: {
    id: number;
    name: string;
    image: string;
  };

  followers_count: number;
  following_count: number;
  created_at: string;
}
export type SocialConnectionMode = "followers" | "following";
