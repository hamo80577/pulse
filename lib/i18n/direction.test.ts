import { describe, expect, it } from "vitest";
import { getDirection } from "./direction";

describe("i18n direction", () => {
  it("uses LTR for English", () => {
    expect(getDirection("en")).toBe("ltr");
  });

  it("uses RTL for Arabic", () => {
    expect(getDirection("ar")).toBe("rtl");
  });
});
