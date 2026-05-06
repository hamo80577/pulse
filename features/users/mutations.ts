import type { Prisma } from "@/generated/prisma/client";
import type { UserCreateInput, UserUpdateInput } from "@/lib/validation/users";

type CreateUserDataInput = {
  input: UserCreateInput;
  passwordHash: string;
};

function toHireDate(value: string | null | undefined) {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

function toProfileData(input: UserCreateInput | UserUpdateInput) {
  return {
    nationalId: input.nationalId,
    shopperId: input.shopperId,
    ibsId: input.ibsId,
    address: input.address,
    personalPhotoUrl: input.personalPhotoUrl,
    idCardFrontUrl: input.idCardFrontUrl,
    idCardBackUrl: input.idCardBackUrl,
    hireDate: toHireDate(input.hireDate),
    employmentStatus: input.employmentStatus,
  };
}

export function buildCreateUserData({ input, passwordHash }: CreateUserDataInput) {
  return {
    name: input.name,
    email: input.email,
    phone: input.phone,
    role: input.role,
    status: input.status,
    passwordHash,
    mustChangePassword: true,
    employeeProfile: {
      create: toProfileData(input),
    },
  } satisfies Prisma.UserCreateInput;
}

export function buildUpdateUserData(input: UserUpdateInput) {
  return {
    user: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      role: input.role,
      status: input.status,
    },
    profile: toProfileData(input),
  };
}

type EmployeeProfileAuditInput = {
  existingProfile: Prisma.EmployeeProfileGetPayload<object> | null;
  savedProfile: Prisma.EmployeeProfileGetPayload<object>;
};

export function buildEmployeeProfileAuditMetadata({
  existingProfile,
  savedProfile,
}: EmployeeProfileAuditInput) {
  return {
    action: existingProfile
      ? "EMPLOYEE_PROFILE_UPDATED"
      : "EMPLOYEE_PROFILE_CREATED",
    entityId: savedProfile.id,
    oldValueJson: toAuditJson(existingProfile),
    newValueJson: toAuditJson(savedProfile),
  };
}

export function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export function toAuditJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
