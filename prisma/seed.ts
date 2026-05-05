import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { hashPassword } from "../lib/auth/password";

const username = process.env.SUPER_ADMIN_USERNAME ?? "superadmin";
const password = process.env.SUPER_ADMIN_PASSWORD;
const name = process.env.SUPER_ADMIN_NAME ?? "Super Admin";
const email = process.env.SUPER_ADMIN_EMAIL ?? "superadmin@example.com";

if (!password) {
  throw new Error("SUPER_ADMIN_PASSWORD is required to seed the Super Admin user.");
}

const superAdminPassword = password;

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/plus?schema=public",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await hashPassword(superAdminPassword);
  const user = await prisma.user.upsert({
    where: { username },
    update: {
      name,
      email,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      passwordHash,
      mustChangePassword: false,
    },
    create: {
      name,
      username,
      email,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      passwordHash,
      mustChangePassword: false,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: user.id,
      action: "AUTH_SUPER_ADMIN_SEEDED",
      entityType: "User",
      entityId: user.id,
    },
  });

  console.log(`Seeded Super Admin user: ${username}`);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
