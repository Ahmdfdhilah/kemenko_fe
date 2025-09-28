// src/redux/features/auth.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from '@workspace/ui/components/sonner';
import type {
    UserProfile,
} from '@/services/auth';
import { getTokenExpiry } from '@/utils/jwt';
import { getProfile, loginUser, registerUser, updateProfile, updateProfileImage } from './thunks';
import { AuthState } from './types';

// Initial state
const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('auth_token'),
    tokenExpiry: localStorage.getItem('token_expiry') ? Number(localStorage.getItem('token_expiry')) : null,
    isAuthenticated: !!localStorage.getItem('auth_token'),
    isLoading: false,
    error: null,
};

// Auth Slice
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.tokenExpiry = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('token_expiry');
            toast.success('Logout berhasil');
        },
        clearError: (state) => {
            state.error = null;
        },
        setCredentials: (state, action: PayloadAction<{ token: string; user?: UserProfile }>) => {
            const { token, user } = action.payload;
            state.token = token;
            state.user = user || state.user;
            state.isAuthenticated = true;
            state.tokenExpiry = getTokenExpiry(token);
            localStorage.setItem('auth_token', token);
            localStorage.setItem('token_expiry', state.tokenExpiry?.toString() || '');
        },
        checkTokenExpiry: (state) => {
            const now = Date.now() / 1000;
            if (state.tokenExpiry && now > state.tokenExpiry) {
                state.user = null;
                state.token = null;
                state.tokenExpiry = null;
                state.isAuthenticated = false;
                localStorage.removeItem('auth_token');
                localStorage.removeItem('token_expiry');
                toast.error('Session expired', { description: 'Please login again' });
            }
        },
    },
    extraReducers: (builder) => {
        // Login cases
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.token;
                state.tokenExpiry = action.payload.tokenExpiry;
                state.isAuthenticated = true;
                state.error = null;
                localStorage.setItem('auth_token', action.payload.token);
                localStorage.setItem('token_expiry', action.payload.tokenExpiry?.toString() || '');
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
            })

        // Register cases
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

        // Get profile cases
        builder
            .addCase(getProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

        // Update profile cases
        builder
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = { ...state.user, ...action.payload };
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

        // Update profile image cases
        builder
            .addCase(updateProfileImage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProfileImage.fulfilled, (state, action) => {
                state.isLoading = false;
                if (state.user) {
                    state.user = { ...state.user, ...action.payload };
                }
                state.error = null;
            })
            .addCase(updateProfileImage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

// Export actions
export const { logout, clearError, setCredentials, checkTokenExpiry } = authSlice.actions;