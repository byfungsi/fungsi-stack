import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(4),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "Password Minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
    ),
});

export type TSignupSchema = z.infer<typeof signupSchema>;
