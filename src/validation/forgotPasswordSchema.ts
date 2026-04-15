import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Unesite validan email"),
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ForgotPasswordErrors = {
  email?: string[];
};
