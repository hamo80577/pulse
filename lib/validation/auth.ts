import { z } from "zod";
import { verifyPassword } from "../auth/password";

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

type FirstLoginContext = {
  username: string;
  currentPasswordHash?: string | null;
};

export async function validateFirstLoginInput(
  input: FirstLoginInput,
  context: FirstLoginContext,
) {
  const parsed = firstLoginSchema.safeParse(input);

  if (!parsed.success) {
    return parsed;
  }

  if (parsed.data.password.toLowerCase() === context.username.toLowerCase()) {
    return {
      success: false as const,
      error: new z.ZodError([
        {
          code: "custom",
          message: "Password cannot match username.",
          path: ["password"],
          input: parsed.data.password,
        },
      ]),
    };
  }

  if (
    context.currentPasswordHash &&
    await verifyPassword(parsed.data.password, context.currentPasswordHash)
  ) {
    return {
      success: false as const,
      error: new z.ZodError([
        {
          code: "custom",
          message: "Password cannot reuse the current password.",
          path: ["password"],
          input: parsed.data.password,
        },
      ]),
    };
  }

  return parsed;
}
