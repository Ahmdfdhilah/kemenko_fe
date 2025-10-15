// src/redux/features/auth/auth.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService, LoginRequest, RefreshTokenRequest } from '@/services/auth';
import { UserBase } from '@/services/users';

// Auth State Interface
export interface AuthState {
    user: UserBase | null;
    accessToken: string | null;
    refreshToken: string | null;
    tokenType: string | null;
    expiresIn: number | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Initial State
const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    tokenType: null,
    expiresIn: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// Async Thunks
export const loginAsync = createAsyncThunk(
    'auth/login',
    async (credentials: LoginRequest, { rejectWithValue }) => {
        try {
            const response = await authService.authLogin(credentials);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const logoutAsync = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authService.authLogout();
            return;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Logout failed');
        }
    }
);

export const refreshTokenAsync = createAsyncThunk(
    'auth/refreshToken',
    async (refreshTokenData: RefreshTokenRequest, { rejectWithValue }) => {
        try {
            const response = await authService.authRefreshToken(refreshTokenData);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Token refresh failed');
        }
    }
);

export const getProfileAsync = createAsyncThunk(
    'auth/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.authGetProfile();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get profile');
        }
    }
);

// Auth Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Manual actions
        clearError: (state) => {
            state.error = null;
        },
        clearAuth: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.tokenType = null;
            state.expiresIn = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        setTokens: (state, action: PayloadAction<{
            accessToken: string;
            refreshToken?: string;
            tokenType?: string;
            expiresIn?: number;
        }>) => {
            const { accessToken, refreshToken, tokenType, expiresIn } = action.payload;
            state.accessToken = accessToken;
            if (refreshToken) state.refreshToken = refreshToken;
            if (tokenType) state.tokenType = tokenType;
            if (expiresIn) state.expiresIn = expiresIn;
            state.isAuthenticated = true;
        },
        updateUser: (state, action: PayloadAction<UserBase>) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Login cases
        builder
            .addCase(loginAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.access_token || null;
                state.refreshToken = action.payload.refresh_token || null;
                state.tokenType = action.payload.token_type || null;
                state.expiresIn = action.payload.expires_in || null;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
            })

            // Logout cases
            .addCase(logoutAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.tokenType = null;
                state.expiresIn = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                // Still clear auth data even if logout fails
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.tokenType = null;
                state.expiresIn = null;
                state.isAuthenticated = false;
            })

            // Refresh token cases
            .addCase(refreshTokenAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(refreshTokenAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.accessToken = action.payload.access_token;
                state.tokenType = action.payload.token_type;
                state.expiresIn = action.payload.expires_in;
                state.error = null;
            })
            .addCase(refreshTokenAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                // Clear tokens if refresh fails
                state.accessToken = null;
                state.refreshToken = null;
                state.tokenType = null;
                state.expiresIn = null;
                state.isAuthenticated = false;
                state.user = null;
            })

            // Get profile cases
            .addCase(getProfileAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getProfileAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(getProfileAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

// Export actions
export const { clearError, clearAuth, setTokens, updateUser } = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectRefreshToken = (state: { auth: AuthState }) => state.auth.refreshToken;

// Export reducer
export default authSlice.reducer;