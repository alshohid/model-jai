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

export type IAuthUserRole = "user" | "admin" | null;
export const RoleUtils = {
    isAdmin: (role?: IAuthUserRole | null) => role === "admin",
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
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    avatar_url: string | null;
    address: string | null;
    phone_number: string | null;
    type: "user" | "admin"; // User Role
    gender: "male" | "female" | "other" | null;
    date_of_birth: string | null; // ISO date string
    created_at: string; // ISO datetime string
}

export type IAuthUpdateUserParams = Omit<Partial<IAuthUser>, "avatar"> & {
    avatar?: File;
};

export interface IAuthRegisterParams {
    name: string;
    email: string;
    password: string;
}

export interface IAuthRegisterResponse {
    success: boolean;
    message: string;
}

export interface IAuthVerifyEmailParams {
    email: string;
    token: string;
}

export interface IAuthChangePasswordParams {
    old_password: string;
    new_password: string;
}
