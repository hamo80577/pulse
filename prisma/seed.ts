import "dotenv/config";
import { hashPassword } from "../lib/auth/password";

type SuperAdminSeedInput = {
  username: string;
  name: string;
  email: string;
  passwordHash: string;
  forcePasswordChange?: boolean;
};

export function buildSuperAdminSeedData(input: SuperAdminSeedInput) {
  const mustChangePassword = input.forcePasswordChange ?? true;

  return {
    where: { username: input.username },
    update: {
      name: input.name,
      email: input.email,
      role: "SUPER_ADMIN" as const,
      status: "ACTIVE" as const,
      passwordHash: input.passwordHash,
      mustChangePassword,
    },
    create: {
      name: input.name,
      username: input.username,
      email: input.email,
      role: "SUPER_ADMIN" as const,
      status: "ACTIVE" as const,
      passwordHash: input.passwordHash,
      mustChangePassword,
    },
  };
}

async function main() {
  const [{ PrismaPg }, { PrismaClient }] = await Promise.all([
    import("@prisma/adapter-pg"),
    import("../generated/prisma/client"),
  ]);
  const username = process.env.SUPER_ADMIN_USERNAME ?? "superadmin";
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const name = process.env.SUPER_ADMIN_NAME ?? "Super Admin";
  const email = process.env.SUPER_ADMIN_EMAIL ?? "superadmin@example.com";
  const forcePasswordChange = process.env.SUPER_ADMIN_FORCE_PASSWORD_CHANGE !== "false";

  if (!password) {
    throw new Error("SUPER_ADMIN_PASSWORD is required to seed the Super Admin user.");
  }

  const adapter = new PrismaPg({
    connectionString:
      process.env.DATABASE_URL ??
      "postgresql://pulse_app:replace-with-a-local-password@localhost:5433/pulse_local?schema=public",
  });

  const prisma = new PrismaClient({ adapter });
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.upsert(
    buildSuperAdminSeedData({
      username,
      name,
      email,
      passwordHash,
      forcePasswordChange,
    }),
  );

  await prisma.auditLog.create({
    data: {
      actorUserId: user.id,
      action: "AUTH_SUPER_ADMIN_SEEDED",
      entityType: "User",
      entityId: user.id,
    },
  });

  console.log(`Seeded Super Admin user: ${username}`);
  await prisma.$disconnect();
}

if (process.env.VITEST !== "true") {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
