import { prisma } from "@/lib/db/prisma";

export async function getOrganizationOverview() {
  const [chainCount, branchCount, activeAssignmentCount, activeRelationCount] =
    await Promise.all([
      prisma.chain.count(),
      prisma.branch.count(),
      prisma.branchAssignment.count({ where: { status: "ACTIVE" } }),
      prisma.managerRelation.count({ where: { status: "ACTIVE" } }),
    ]);

  return {
    chainCount,
    branchCount,
    activeAssignmentCount,
    activeRelationCount,
  };
}

export async function getChains() {
  return prisma.chain.findMany({
    include: {
      _count: {
        select: {
          branches: true,
        },
      },
    },
    orderBy: [{ name: "asc" }],
  });
}

export async function getChainDetail(chainId: string) {
  return prisma.chain.findUnique({
    where: { id: chainId },
    include: {
      branches: {
        orderBy: [{ name: "asc" }],
      },
    },
  });
}

export async function getBranches() {
  return prisma.branch.findMany({
    include: {
      chain: true,
      _count: {
        select: {
          assignments: true,
        },
      },
    },
    orderBy: [{ chain: { name: "asc" } }, { name: "asc" }],
  });
}

export async function getBranchDetail(branchId: string) {
  return prisma.branch.findUnique({
    where: { id: branchId },
    include: {
      chain: true,
      assignments: {
        include: {
          user: true,
          createdBy: true,
        },
        orderBy: [{ status: "asc" }, { startDate: "desc" }],
      },
    },
  });
}

export async function getOrganizationTree() {
  return prisma.chain.findMany({
    include: {
      branches: {
        include: {
          assignments: {
            where: { status: "ACTIVE" },
            include: {
              user: true,
            },
            orderBy: [{ roleAtBranch: "asc" }, { user: { name: "asc" } }],
          },
        },
        orderBy: [{ name: "asc" }],
      },
    },
    orderBy: [{ name: "asc" }],
  });
}

export async function getBranchFormOptions() {
  const chains = await prisma.chain.findMany({
    where: { status: "ACTIVE" },
    orderBy: [{ name: "asc" }],
  });

  return { chains };
}

export async function getAssignmentFormOptions() {
  const [branches, users] = await Promise.all([
    prisma.branch.findMany({
      where: { status: "ACTIVE" },
      include: { chain: true },
      orderBy: [{ chain: { name: "asc" } }, { name: "asc" }],
    }),
    prisma.user.findMany({
      where: {
        status: "ACTIVE",
        role: {
          in: ["PICKER", "CHAMP"],
        },
      },
      orderBy: [{ role: "asc" }, { name: "asc" }],
    }),
  ]);

  return { branches, users };
}

export async function getManagerRelationFormOptions() {
  const users = await prisma.user.findMany({
    where: {
      status: "ACTIVE",
      role: {
        in: [
          "PICKER",
          "CHAMP",
          "AREA_MANAGER",
          "OPERATIONS_MANAGER",
          "SENIOR_OPERATIONS_MANAGER",
        ],
      },
    },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });

  return { users };
}

export async function getActiveManagerRelations() {
  return prisma.managerRelation.findMany({
    where: { status: "ACTIVE" },
    include: {
      employee: true,
      manager: true,
    },
    orderBy: [{ startDate: "desc" }],
  });
}
