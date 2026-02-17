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

export type IAuthUserRole = "user" | "superadmin" | "artist" | null;
export const RoleUtils = {
  isAdmin: (role?: IAuthUserRole | null) => role === "superadmin",
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
  email: string;
  image: string | null;
  provider: string | null;
  verified_at: boolean;
  suspended_until: string | null;
  is_permanent_suspended: boolean | null;
  suspension_reason: string | null;
  note: string | null;
  role: "user" | "superadmin";
  referral_no: string;
  created_at: string;
}

export type IAuthUpdateUserParams = Omit<Partial<IAuthUser>, "avatar"> & {
  avatar?: File;
};

export interface IAuthRegisterParams {
  name: string;
  email: string;
  password: string;
  c_password: string;
}

export interface IAuthRegisterResponse {
  success: boolean;
  message: string;
  data: IAuthUser;
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
