import { z } from "zod";
import { verifyPassword } from "../auth/password";

const simplePasswordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters.")
  .regex(/^[a-zA-Z0-9]+$/, "Password can contain letters and numbers only.");

export const loginSchema = z.object({
  phone: z.string().trim().min(1, "Phone is required."),
  password: z.string().min(1, "Password is required."),
});

export const firstLoginSchema = z
  .object({
    token: z.string().trim().optional(),
    password: simplePasswordSchema,
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
