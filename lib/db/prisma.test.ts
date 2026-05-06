import { describe, expect, it } from "vitest";
import { hasRequiredPrismaDelegates } from "./prisma-client-guard";

describe("Prisma client singleton guard", () => {
  it("rejects stale clients missing Phase 3 delegates", () => {
    expect(
      hasRequiredPrismaDelegates({
        user: {},
        chain: {},
        branch: {},
      } as never),
    ).toBe(false);
  });

  it("accepts clients with required Phase 3 delegates", () => {
    expect(
      hasRequiredPrismaDelegates({
        user: {},
        chain: {},
        branch: {},
        employeeProfile: {},
      } as never),
    ).toBe(true);
  });
});
