import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Lozinka mora imati najmanje 6 karaktera"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Lozinke se ne podudaraju",
    path: ["confirmPassword"],
  });

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordErrors = {
  password?: string[];
  confirmPassword?: string[];
};
