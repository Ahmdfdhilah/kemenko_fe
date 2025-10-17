import { z } from 'zod';

// Root Folder DTO (no parent_id or parent_id = null)
export const rootFolderSchema = z.object({
  title: z
    .string()
    .min(1, 'Judul wajib diisi')
    .min(3, 'Judul minimal 3 karakter')
    .max(100, 'Judul maksimal 100 karakter'),
  description: z
    .string()
    .min(1, 'Deskripsi wajib diisi')
    .min(10, 'Deskripsi minimal 10 karakter')
    .max(500, 'Deskripsi maksimal 500 karakter'),
});

export type RootFolderDto = z.infer<typeof rootFolderSchema>;

// Sub Folder DTO (parent_id is required)
export const subFolderSchema = z.object({
  title: z
    .string()
    .min(1, 'Judul wajib diisi')
    .min(3, 'Judul minimal 3 karakter')
    .max(100, 'Judul maksimal 100 karakter'),
  description: z
    .string()
    .min(1, 'Deskripsi wajib diisi')
    .min(10, 'Deskripsi minimal 10 karakter')
    .max(500, 'Deskripsi maksimal 500 karakter'),
  parent_id: z.string().min(1, 'Parent ID wajib ada'),
});

export type SubFolderDto = z.infer<typeof subFolderSchema>;
