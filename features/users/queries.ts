import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

export const userListSelect = {
  id: true,
  name: true,
  username: true,
  email: true,
  phone: true,
  role: true,
  status: true,
  mustChangePassword: true,
  createdAt: true,
  employeeProfile: {
    select: {
      employmentStatus: true,
      shopperId: true,
      ibsId: true,
    },
  },
} satisfies Prisma.UserSelect;

export const userDetailSelect = {
  id: true,
  name: true,
  username: true,
  email: true,
  phone: true,
  role: true,
  status: true,
  mustChangePassword: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
  employeeProfile: {
    select: {
      id: true,
      nationalId: true,
      shopperId: true,
      ibsId: true,
      address: true,
      personalPhotoUrl: true,
      idCardFrontUrl: true,
      idCardBackUrl: true,
      hireDate: true,
      employmentStatus: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} satisfies Prisma.UserSelect;

export type UserListItem = Prisma.UserGetPayload<{ select: typeof userListSelect }>;
export type UserDetail = Prisma.UserGetPayload<{ select: typeof userDetailSelect }>;

export type UserFilters = {
  role?: string;
  status?: string;
  search?: string;
};

export async function getWorkforceOverview() {
  const [
    totalUsers,
    activeUsers,
    pendingSetupUsers,
    profileCount,
    pickerCount,
    champCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { mustChangePassword: true } }),
    prisma.employeeProfile.count(),
    prisma.user.count({ where: { role: "PICKER" } }),
    prisma.user.count({ where: { role: "CHAMP" } }),
  ]);

  return {
    totalUsers,
    activeUsers,
    pendingSetupUsers,
    profileCount,
    pickerCount,
    champCount,
  };
}

export async function getUsers(filters: UserFilters = {}) {
  const search = filters.search?.trim();

  return prisma.user.findMany({
    where: {
      ...(filters.role ? { role: filters.role as never } : {}),
      ...(filters.status ? { status: filters.status as never } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { username: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
              {
                employeeProfile: {
                  is: {
                    OR: [
                      { shopperId: { contains: search, mode: "insensitive" } },
                      { ibsId: { contains: search, mode: "insensitive" } },
                    ],
                  },
                },
              },
            ],
          }
        : {}),
    },
    select: userListSelect,
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });
}

export async function getUserDetail(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: userDetailSelect,
  });
}

export async function getUserAssignmentSummary(userId: string) {
  const [assignments, managerRelations, employeeRelations] = await Promise.all([
    prisma.branchAssignment.findMany({
      where: { userId },
      select: {
        id: true,
        roleAtBranch: true,
        status: true,
        startDate: true,
        endDate: true,
        branch: {
          select: {
            name: true,
            chain: { select: { name: true } },
          },
        },
      },
      orderBy: [{ status: "asc" }, { startDate: "desc" }],
    }),
    prisma.managerRelation.findMany({
      where: { managerUserId: userId },
      select: {
        id: true,
        relationType: true,
        status: true,
        employee: { select: { id: true, name: true, role: true } },
      },
      orderBy: [{ status: "asc" }, { startDate: "desc" }],
    }),
    prisma.managerRelation.findMany({
      where: { employeeUserId: userId },
      select: {
        id: true,
        relationType: true,
        status: true,
        manager: { select: { id: true, name: true, role: true } },
      },
      orderBy: [{ status: "asc" }, { startDate: "desc" }],
    }),
  ]);

  return { assignments, managerRelations, employeeRelations };
}
