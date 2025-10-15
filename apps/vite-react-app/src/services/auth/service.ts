import { BaseService } from "@/services/base";
import {
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse
} from "./"
import { UserBase } from "@/services/users";

export class AuthService extends BaseService {
    constructor() {
        super('/auth');
    }

    async authLogin(data: LoginRequest): Promise<LoginResponse> {
        return this.post<LoginResponse>('/login', data);
    }

    async authLogout(): Promise<{ message: string }> {
        return this.post<{ message: string }>('/logout');
    }


    async authRefreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
        return this.post<RefreshTokenResponse>('/refresh', data);
    }


    async authGetProfile(): Promise<UserBase> {
        return this.get<UserBase>('/me');
    }

}

// Export instance
export const authService = new AuthService();