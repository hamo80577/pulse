type DatabaseEnvironment = {
  [key: string]: string | undefined;
  DATABASE_URL?: string;
};

export function getDatabaseUrl(env: DatabaseEnvironment = process.env) {
  if (!env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is required. Set it in the runtime environment or .env before starting Pulse.",
    );
  }

  return env.DATABASE_URL;
}
