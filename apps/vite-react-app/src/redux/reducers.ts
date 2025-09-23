// src/redux/reducers.ts
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/redux/features/auth/auth';
import themeReducer from '@/redux/features/theme/theme';

export const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
});

export type RootReducer = ReturnType<typeof rootReducer>;