import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().min(1, "Email wajib diisi").email("Email tidak valid"),
  phone: z.string().min(8, "Nomor telepon minimal 8 digit"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
