import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Phase 4 remains generic", () => {
  it("does not add Phase 5 annual leave route surfaces", () => {
    expect(existsSync("app/(dashboard)/picker/requests")).toBe(false);
    expect(existsSync("app/(dashboard)/champ/approvals")).toBe(false);
    expect(existsSync("docs/specs/phase-05-annual-leave-request.md")).toBe(false);
  });
});
