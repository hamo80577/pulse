import { z } from "zod";

const strongPasswordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters.")
  .regex(/[a-z]/, "Password must include a lowercase letter.")
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[0-9]/, "Password must include a number.")
  .regex(/[^a-zA-Z0-9]/, "Password must include a symbol.");

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

export const firstLoginSchema = z
  .object({
    token: z.string().trim().optional(),
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .superRefine((value, context) => {
    if (value.password !== value.confirmPassword) {
      context.addIssue({
        code: "custom",
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type FirstLoginInput = z.infer<typeof firstLoginSchema>;
