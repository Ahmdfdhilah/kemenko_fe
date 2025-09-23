import { BaseService } from "@/services/base";
import {
    RegistrationRequest,
    LoginRequest,
    UpdateProfileRequest,
    RegistrationResponse,
    ProfileResponse,
    UpdateProfileResponse,
    UpdateProfileImageResponse,
    LoginResponse
} from "./types";

export class MembershipService extends BaseService {
    constructor() {
        super(''); // can be separated route for better context
    }

    /**
     * Register new user
     * POST /registration
     * Public API - No token required
     */
    async register(data: RegistrationRequest): Promise<RegistrationResponse> {
        return this.post<RegistrationResponse>('/registration', data);
    }

    /**
     * Login user and get JWT token
     * POST /login
     * Public API - No token required
     */
    async login(data: LoginRequest): Promise<LoginResponse> {
        return this.post<LoginResponse>('/login', data);
    }

    /**
     * Get user profile
     * GET /profile
     * Private API - Requires Bearer token
     */
    async getProfile(): Promise<ProfileResponse> {
        return this.get<ProfileResponse>('/profile');
    }

    /**
     * Update user profile (first_name and last_name)
     * PUT /profile/update
     * Private API - Requires Bearer token
     */
    async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
        return this.put<UpdateProfileResponse>('/profile/update', data);
    }

    /**
     * Upload/Update profile image
     * PUT /profile/image
     * Private API - Requires Bearer token
     * Accepts only jpeg and png formats
     */
    async updateProfileImage(file: File): Promise<UpdateProfileImageResponse> {
        // Validate file format
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Format file harus jpeg atau png');
        }

        // Create FormData for multipart/form-data
        const formData = new FormData();
        formData.append('file', file);

        return this.put<UpdateProfileImageResponse>('/profile/image', formData);
    }

    /**
     * Utility method to validate email format
     */
    static validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Utility method to validate password length
     */
    static validatePassword(password: string): boolean {
        return password.length >= 8;
    }

    /**
     * Utility method to validate registration data
     */
    static validateRegistration(data: RegistrationRequest): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        if (!this.validateEmail(data.email)) {
            errors.push('Format email tidak valid');
        }

        if (!this.validatePassword(data.password)) {
            errors.push('Password minimal 8 karakter');
        }

        if (!data.first_name.trim()) {
            errors.push('First name wajib diisi');
        }

        if (!data.last_name.trim()) {
            errors.push('Last name wajib diisi');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Utility method to validate login data
     */
    static validateLogin(data: LoginRequest): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        if (!this.validateEmail(data.email)) {
            errors.push('Format email tidak valid');
        }

        if (!this.validatePassword(data.password)) {
            errors.push('Password minimal 8 karakter');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

// Export instance
export const membershipService = new MembershipService();