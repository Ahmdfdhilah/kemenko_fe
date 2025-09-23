import { createAsyncThunk } from '@reduxjs/toolkit';
import { membershipService, MembershipService } from '@/services/membership';
import { toast } from '@workspace/ui/components/sonner';
import type {
    RegistrationRequest,
    LoginRequest,
    UpdateProfileRequest,
} from '@/services/membership';
import { getTokenExpiry } from '@/utils/jwt';

// Async Thunks
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: LoginRequest, { rejectWithValue }) => {
        try {
            // Validate login data
            const validation = MembershipService.validateLogin(credentials as LoginRequest);
            if (!validation.isValid) {
                validation.errors.forEach(error => toast.error(error));
                return rejectWithValue(validation.errors[0]);
            }

            const response = await membershipService.login(credentials as LoginRequest);

            if (response.status === 0 && response.data) {
                const tokenExpiry = getTokenExpiry(response.data.token);
                toast.success('Login berhasil', { description: 'Selamat Datang ke SIMS PPOP' });
                return {
                    token: response.data.token,
                    tokenExpiry,
                };
            } else {
                toast.error('Login gagal', { description: response.message || 'Terjadi kesalahan' });
                return rejectWithValue(response.message || 'Login failed');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Network error';
            toast.error('Login gagal', { description: errorMessage });
            return rejectWithValue(errorMessage);
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData: RegistrationRequest, { rejectWithValue }) => {
        try {
            // Validate registration data
            const validation = MembershipService.validateRegistration(userData as RegistrationRequest);
            if (!validation.isValid) {
                validation.errors.forEach(error => toast.error(error));
                return rejectWithValue(validation.errors[0]);
            }

            const response = await membershipService.register(userData as RegistrationRequest);

            if (response.status === 0) {
                toast.success('Registrasi berhasil', { description: 'Akun berhasil dibuat, silakan login' });
                return response.message || 'Registration successful';
            } else {
                toast.error('Registrasi gagal', { description: response.message || 'Terjadi kesalahan' });
                return rejectWithValue(response.message || 'Registration failed');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Network error';
            toast.error('Registrasi gagal', { description: errorMessage });
            return rejectWithValue(errorMessage);
        }
    }
);

export const getProfile = createAsyncThunk(
    'auth/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await membershipService.getProfile();

            if (response.status === 0 && response.data) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Failed to get profile');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Network error';
            return rejectWithValue(errorMessage);
        }
    }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (profileData: UpdateProfileRequest, { rejectWithValue }) => {
        try {
            const response = await membershipService.updateProfile(profileData as UpdateProfileRequest);

            if (response.status === 0 && response.data) {
                toast.success('Profil berhasil diupdate', {
                    description: 'Data telah di refresh'
                });
                return response.data;
            } else {
                toast.error('Update profil gagal', { description: response.message || 'Terjadi kesalahan' });
                return rejectWithValue(response.message || 'Update failed');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Network error';
            toast.error('Update profil gagal', { description: errorMessage });
            return rejectWithValue(errorMessage);
        }
    }
);

export const updateProfileImage = createAsyncThunk(
    'auth/updateProfileImage',
    async (file: File, { rejectWithValue }) => {
        try {
            const response = await membershipService.updateProfileImage(file);

            if (response.status === 0 && response.data) {
                toast.success('Foto profil berhasil diupdate', {
                    description: "Data telah di refresh"
                });
                return response.data;
            } else {
                toast.error('Update foto profil gagal', { description: response.message || 'Terjadi kesalahan' });
                return rejectWithValue(response.message || 'Update failed');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Network error';
            toast.error('Update foto profil gagal', { description: errorMessage });
            return rejectWithValue(errorMessage);
        }
    }
);