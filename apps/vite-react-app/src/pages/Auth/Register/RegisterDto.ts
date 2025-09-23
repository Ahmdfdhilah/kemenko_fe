import { z } from 'zod';

// Zod validation schema
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  first_name: z
    .string()
    .min(1, 'Nama depan wajib diisi')
    .min(2, 'Nama depan minimal 2 karakter')
    .max(50, 'Nama depan maksimal 50 karakter'),
  last_name: z
    .string()
    .min(1, 'Nama belakang wajib diisi')
    .min(2, 'Nama belakang minimal 2 karakter')
    .max(50, 'Nama belakang maksimal 50 karakter'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(50, 'Password maksimal 50 karakter')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password harus mengandung huruf besar, huruf kecil, dan angka'),
  confirm_password: z
    .string()
    .min(1, 'Konfirmasi password wajib diisi'),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirm_password'],
});

export type RegisterDto = z.infer<typeof registerSchema>;