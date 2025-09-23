import { ApiResponse } from "@/services/base";

// Request Types
export interface RegistrationRequest {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UpdateProfileRequest {
    first_name: string;
    last_name: string;
}

// Response Data Types
export interface UserProfile {
    email: string;
    first_name: string;
    last_name: string;
    profile_image: string;
}

export interface Login {
    token: string;
}

// API Response Types
export interface RegistrationResponse extends ApiResponse<null> { }

export interface LoginResponse extends ApiResponse<Login> { }

export interface ProfileResponse extends ApiResponse<UserProfile> { }

export interface UpdateProfileResponse extends ApiResponse<UserProfile> { }

export interface UpdateProfileImageResponse extends ApiResponse<UserProfile> { }