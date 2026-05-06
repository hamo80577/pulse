import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { getDatabaseUrl } from "./database-url";
import { isCompatiblePrismaClient } from "./prisma-client-guard";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
});

function createPrismaClient() {
  return new PrismaClient({ adapter });
}

let prismaClient = globalForPrisma.prisma;

if (!isCompatiblePrismaClient(prismaClient, PrismaClient)) {
  prismaClient = createPrismaClient();
}

export const prisma: PrismaClient = prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
