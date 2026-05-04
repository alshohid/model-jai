/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface ILoginPayload {
  success: boolean;
  message: string;
  type?: IAuthUserRole; // Legacy role location
  data?: {
    access_token?: string;
    refresh_token?: string;
    token_type?: string;
    expires_in?: number;
    user?: {
      name?: string;
      email?: string;
      image?: string | null;
      email_verified?: boolean;
      role?: IAuthUserRole | string;
    };
  };
}
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
export interface IUser {
  game: any;
  id: number;
  name: string;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  email: string;
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
}
export interface IUserInfoResponse {
  user: IUser;
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
