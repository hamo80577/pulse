export const APPROVAL_LIST_PAGE_SIZE = 25;
export const APPROVAL_LIST_MAX_PAGE_SIZE = 50;

export type ApprovalListOptions = {
  page?: number | string | null;
  pageSize?: number | string | null;
};

export type NormalizedApprovalListOptions = {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
};

function toPositiveInteger(value: ApprovalListOptions[keyof ApprovalListOptions]) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function normalizeApprovalListOptions(
  options: ApprovalListOptions = {},
): NormalizedApprovalListOptions {
  const page = toPositiveInteger(options.page) ?? 1;
  const requestedPageSize =
    toPositiveInteger(options.pageSize) ?? APPROVAL_LIST_PAGE_SIZE;
  const pageSize = Math.min(requestedPageSize, APPROVAL_LIST_MAX_PAGE_SIZE);

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}
