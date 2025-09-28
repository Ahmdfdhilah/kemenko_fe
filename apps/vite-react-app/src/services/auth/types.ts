import { UserBase } from "@/services/users";

//RESPONSE
export interface LoginResponse {
    user: UserBase;
    access_token?: string | null;
    refresh_token?: string | null;
    token_type?: string | null;
    expires_in?: number | null
}

export interface RefreshTokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

//REQUEST
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}