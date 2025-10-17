import { z } from 'zod';

// Zod validation schema for file link
export const fileLinkSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama file wajib diisi')
    .min(3, 'Nama file minimal 3 karakter')
    .max(255, 'Nama file maksimal 255 karakter'),
  external_link: z
    .string()
    .min(1, 'Link wajib diisi')
    .url('Format URL tidak valid'),
  description: z
    .string(),
});

export type FileLinkDto = z.infer<typeof fileLinkSchema>;

// Zod validation schema for file upload
export const fileUploadSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama file wajib diisi')
    .min(3, 'Nama file minimal 3 karakter')
    .max(255, 'Nama file maksimal 255 karakter'),
  description: z
    .string(),
  file: z
    .instanceof(File, { message: 'File wajib dipilih' })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: 'Ukuran file maksimal 10MB',
    })
    .refine(
      (file) => {
        const allowedTypes = [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'image/gif',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/zip',
          'application/x-rar-compressed',
        ];
        return allowedTypes.includes(file.type);
      },
      {
        message: 'Tipe file tidak didukung',
      }
    ),
});

export type FileUploadDto = z.infer<typeof fileUploadSchema>;
