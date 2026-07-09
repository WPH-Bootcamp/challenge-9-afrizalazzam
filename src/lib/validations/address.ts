import { z } from "zod";

export const addressFormSchema = z.object({
  label: z
    .string()
    .min(2, "Label minimal 2 karakter")
    .max(30, "Label maksimal 30 karakter"),
  address: z
    .string()
    .min(10, "Alamat minimal 10 karakter")
    .max(200, "Alamat maksimal 200 karakter"),
  phone: z
    .string()
    .min(8, "Nomor telepon minimal 8 digit")
    .regex(/^[0-9+\-\s]+$/, "Nomor telepon tidak valid"),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;
