import { z } from "zod";

export const addressSchema = z.object({
  deliveryAddress: z
    .string()
    .min(10, "Alamat minimal 10 karakter")
    .max(200, "Alamat maksimal 200 karakter"),
  phone: z
    .string()
    .min(8, "Nomor telepon minimal 8 digit")
    .regex(/^[0-9+\-\s]+$/, "Nomor telepon tidak valid"),
  notes: z.string().max(200, "Catatan maksimal 200 karakter").optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
