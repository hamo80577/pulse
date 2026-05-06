import { describe, expect, it } from "vitest";
import {
  defaultLanguagePreference,
  defaultThemePreference,
  isThemePreference,
} from "./defaults";

describe("preference defaults", () => {
  it("defaults to English and light appearance", () => {
    expect(defaultLanguagePreference).toBe("en");
    expect(defaultThemePreference).toBe("light");
  });

  it("accepts only supported theme preferences", () => {
    expect(isThemePreference("light")).toBe(true);
    expect(isThemePreference("dark")).toBe(true);
    expect(isThemePreference("system")).toBe(true);
    expect(isThemePreference("sepia")).toBe(false);
  });
});
