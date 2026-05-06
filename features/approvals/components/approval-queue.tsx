import type { ApprovalRequestListItem } from "../queries";
import { RequestList } from "./request-list";

export function ApprovalQueue({
  requests,
}: {
  requests: ApprovalRequestListItem[];
}) {
  return <RequestList detailBasePath="/approvals" requests={requests} />;
}
