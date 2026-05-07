import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("stitch reference redesign", () => {
  it("uses the reference enterprise shell structure", () => {
    const shell = readFileSync("components/layout/erp-shell.tsx", "utf8");
    const nav = readFileSync("lib/navigation/nav-items.ts", "utf8");

    expect(shell).toContain("fixed top-0 z-40 h-20");
    expect(shell).toContain("lg:fixed lg:left-0 lg:top-20");
    expect(shell).toContain('aria-label="Global search"');
    expect(shell).toContain("Notifications");
    expect(shell).toContain("Help");
    expect(shell).toContain("logoutAction");
    expect(nav).toContain('label: "Users"');
    expect(nav).toContain('label: "Roles"');
  });

  it("uses the reference filter bar fields", () => {
    const filters = readFileSync("features/users/components/user-filters.tsx", "utf8");

    expect(filters).toContain('placeholder="Name, email, phone, shopper ID..."');
    expect(filters).toContain("All Roles");
    expect(filters).toContain("All Statuses");
    expect(filters).toContain("Apply Filters");
  });

  it("renders users in the reference data-table layout", () => {
    const list = readFileSync("features/users/components/user-list.tsx", "utf8");

    expect(list).toContain("<table");
    expect(list).toContain("IBS ID");
    expect(list).toContain("Showing");
    expect(list).toContain("results");
    expect(list).toContain("hover:bg-[var(--surface-container-low)]");
    expect(list).toContain("md:hidden");
  });

  it("defines the imported reference design tokens", () => {
    const css = readFileSync("app/globals.css", "utf8");

    expect(css).toContain("--background: #f8f9ff;");
    expect(css).toContain("--secondary-action: #0058be;");
    expect(css).toContain("--surface-container-lowest: #ffffff;");
    expect(css).toContain("--outline-variant: #c6c6cd;");
  });
});
