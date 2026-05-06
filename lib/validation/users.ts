import { z } from "zod";
import { roles, userStatuses } from "../auth/types";

export const employmentStatuses = [
  "ACTIVE",
  "ON_LEAVE",
  "ON_HOLD",
  "RESIGNED",
  "TERMINATED",
] as const;

const requiredTrimmedString = z.string().trim().min(1);
const optionalTrimmedString = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .optional()
  .or(z.literal("").transform(() => null));
const optionalEmail = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .pipe(z.email().nullable())
  .optional()
  .or(z.literal("").transform(() => null));
const optionalDateString = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .refine((value) => value === null || !Number.isNaN(Date.parse(value)), {
    message: "Enter a valid date.",
  })
  .optional()
  .or(z.literal("").transform(() => null));

export const profileInputSchema = z.object({
  nationalId: optionalTrimmedString,
  shopperId: optionalTrimmedString,
  ibsId: optionalTrimmedString,
  address: optionalTrimmedString,
  personalPhotoUrl: optionalTrimmedString,
  idCardFrontUrl: optionalTrimmedString,
  idCardBackUrl: optionalTrimmedString,
  hireDate: optionalDateString,
  employmentStatus: z.enum(employmentStatuses).default("ACTIVE"),
});

const baseUserSchema = z.object({
  name: requiredTrimmedString,
  username: requiredTrimmedString,
  email: optionalEmail,
  phone: optionalTrimmedString,
  role: z.enum(roles),
  status: z.enum(userStatuses),
});

export const userCreateInputSchema = baseUserSchema.merge(profileInputSchema);
export const userUpdateInputSchema = baseUserSchema.merge(profileInputSchema);

export type UserCreateInput = z.infer<typeof userCreateInputSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateInputSchema>;
export type ProfileInput = z.infer<typeof profileInputSchema>;
export type EmploymentStatusInput = z.infer<typeof profileInputSchema>["employmentStatus"];
