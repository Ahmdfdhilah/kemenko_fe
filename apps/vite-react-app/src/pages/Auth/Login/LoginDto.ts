import { z } from 'zod';

// Zod validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(50, 'Password maksimal 50 karakter'),
});

export type LoginDto = z.infer<typeof loginSchema>;