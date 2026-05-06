import { describe, expect, it } from "vitest";
import {
  APPROVAL_LIST_MAX_PAGE_SIZE,
  APPROVAL_LIST_PAGE_SIZE,
  normalizeApprovalListOptions,
} from "./pagination";

describe("approval list pagination", () => {
  it("uses a bounded default page size", () => {
    expect(APPROVAL_LIST_PAGE_SIZE).toBeGreaterThan(0);
    expect(APPROVAL_LIST_PAGE_SIZE).toBeLessThanOrEqual(50);
    expect(normalizeApprovalListOptions()).toEqual({
      page: 1,
      pageSize: APPROVAL_LIST_PAGE_SIZE,
      skip: 0,
      take: APPROVAL_LIST_PAGE_SIZE,
    });
  });

  it("normalizes invalid pages and clamps oversized page sizes", () => {
    expect(
      normalizeApprovalListOptions({
        page: -4,
        pageSize: APPROVAL_LIST_MAX_PAGE_SIZE + 100,
      }),
    ).toEqual({
      page: 1,
      pageSize: APPROVAL_LIST_MAX_PAGE_SIZE,
      skip: 0,
      take: APPROVAL_LIST_MAX_PAGE_SIZE,
    });
  });

  it("calculates offset from the normalized page", () => {
    expect(normalizeApprovalListOptions({ page: 3, pageSize: 25 })).toEqual({
      page: 3,
      pageSize: 25,
      skip: 50,
      take: 25,
    });
  });
});
