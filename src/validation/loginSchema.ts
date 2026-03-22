import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Unesite validan email"),
  password: z
    .string()
    .min(6, "Lozinka mora imati najmanje 6 karaktera")
    .max(24, "Lozinka ne može imati više od 24 karaktera"),
});

export type LoginData = z.infer<typeof loginSchema>;
export type LoginErrors = {
  email?: string[];
  password?: string[];
};
