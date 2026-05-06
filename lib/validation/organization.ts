import { z } from "zod";

const organizationStatuses = ["ACTIVE", "INACTIVE", "ARCHIVED"] as const;
const branchAssignmentRoles = ["PICKER", "CHAMP"] as const;
const managerRelationTypes = [
  "CHAMP_TO_PICKER",
  "AREA_MANAGER_TO_CHAMP",
  "OPERATIONS_TO_AREA_MANAGER",
] as const;

const requiredTrimmedString = z.string().trim().min(1);
const optionalNormalizedCode = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase())
  .optional()
  .or(z.literal("").transform(() => undefined));

const dateString = z.string().trim().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: "Enter a valid date.",
});

export const chainInputSchema = z.object({
  name: requiredTrimmedString,
  code: optionalNormalizedCode,
  status: z.enum(organizationStatuses).default("ACTIVE"),
});

export const branchInputSchema = z.object({
  chainId: requiredTrimmedString,
  name: requiredTrimmedString,
  code: optionalNormalizedCode,
  address: z.string().trim().optional().or(z.literal("").transform(() => undefined)),
  status: z.enum(organizationStatuses).default("ACTIVE"),
});

export const branchAssignmentInputSchema = z.object({
  userId: requiredTrimmedString,
  branchId: requiredTrimmedString,
  roleAtBranch: z.enum(branchAssignmentRoles),
  startDate: dateString,
  isPrimary: z.coerce.boolean().default(true),
});

export const managerRelationInputSchema = z
  .object({
    employeeUserId: requiredTrimmedString,
    managerUserId: requiredTrimmedString,
    relationType: z.enum(managerRelationTypes),
    startDate: dateString,
  })
  .refine((value) => value.employeeUserId !== value.managerUserId, {
    message: "Employee and manager must be different users.",
    path: ["managerUserId"],
  });

export type ChainInput = z.infer<typeof chainInputSchema>;
export type BranchInput = z.infer<typeof branchInputSchema>;
export type BranchAssignmentInput = z.infer<typeof branchAssignmentInputSchema>;
export type ManagerRelationInput = z.infer<typeof managerRelationInputSchema>;
export type BranchAssignmentRoleInput = z.infer<
  typeof branchAssignmentInputSchema
>["roleAtBranch"];
export type ManagerRelationTypeInput = z.infer<
  typeof managerRelationInputSchema
>["relationType"];
