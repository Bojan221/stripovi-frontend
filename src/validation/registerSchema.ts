import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(4, "Ime mora sadržati najmanje 4 slova")
      .max(16, "Ime može sadržati najviše 16 slova"),
    lastName: z
      .string()
      .min(5, "Prezime mora sadržati najmanje 5 slova")
      .max(16, "Prezime može sadržati najviše 16 slova"),
    email: z.string().email("Unesite validan email"),
    password: z
      .string()
      .min(6, "Lozinka mora imati najmanje 6 karaktera")
      .max(24, "Lozinka ne može imati više od 24 karaktera"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lozinke se ne poklapaju!",
    path: ["confirmPassword"],
  });

export type RegisterData = z.infer<typeof registerSchema>;
export type RegisterErrors = {
  firstName?: string[];
  lastName?: string[];
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
};
