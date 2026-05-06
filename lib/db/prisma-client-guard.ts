export function hasRequiredPrismaDelegates<T extends object>(
  client: T | undefined,
): client is T {
  return Boolean(
    client &&
      "user" in client &&
      "chain" in client &&
      "branch" in client &&
      "employeeProfile" in client,
  );
}

export function isCompatiblePrismaClient<T extends object>(
  client: T | undefined,
  PrismaClientConstructor: abstract new (...args: never[]) => T,
): client is T {
  return (
    hasRequiredPrismaDelegates(client) &&
    client instanceof PrismaClientConstructor
  );
}
