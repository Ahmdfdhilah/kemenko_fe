// import { store } from '@/redux/store';

// // Helper function to decode JWT and extract expiry
// export const getTokenExpiry = (token: string): number | null => {
//     try {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         return payload.exp * 1000; // Convert to milliseconds
//     } catch {
//         return null;
//     }
// };

// // Helper function to get token from store
// export const getAuthToken = (): string | null => {
//   const state = store.getState();
//   return state.auth.token;
// };

// // Helper function to check if token is expired
// export const isTokenExpired = (): boolean => {
//   const state = store.getState();
//   const { tokenExpiry } = state.auth;
  
//   if (!tokenExpiry) return true;
  
//   const now = Date.now() / 1000;
//   return now > tokenExpiry;
// };

// // Helper function to check if token is about to expire (within 2 minutes)
// export const isTokenExpiring = (): boolean => {
//   const state = store.getState();
//   const { tokenExpiry } = state.auth;
  
//   if (!tokenExpiry) return true;
  
//   const now = Date.now() / 1000;
//   const twoMinutes = 2 * 60; // 2 minutes in seconds
//   return (tokenExpiry - now) <= twoMinutes;
// };
