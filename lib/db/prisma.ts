import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { hasRequiredPrismaDelegates } from "./prisma-client-guard";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://pulse_app:replace-with-a-local-password@localhost:5433/pulse_local?schema=public",
});

function createPrismaClient() {
  return new PrismaClient({ adapter });
}

let prismaClient = globalForPrisma.prisma;

if (!hasRequiredPrismaDelegates(prismaClient)) {
  prismaClient = createPrismaClient();
}

export const prisma: PrismaClient = prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
