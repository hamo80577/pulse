import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("global back navigation", () => {
  it("provides a reusable back button in dashboard shells", () => {
    const backButton = readFileSync("components/layout/back-button.tsx", "utf8");
    const dashboardShell = readFileSync("components/layout/dashboard-shell.tsx", "utf8");
    const topbar = readFileSync("components/layout/topbar.tsx", "utf8");

    expect(backButton).toContain("router.back()");
    expect(backButton).toContain("ArrowLeft");
    expect(dashboardShell).toContain("<BackButton");
    expect(topbar).toContain("<BackButton");
  });
});
