import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ApprovalRequestListItem } from "../queries";

export function RequestList({
  requests,
  detailBasePath = "/requests",
}: {
  requests: ApprovalRequestListItem[];
  detailBasePath?: "/requests" | "/approvals";
}) {
  if (requests.length === 0) {
    return (
      <p className="text-sm leading-6 text-muted-foreground">
        No approval requests found.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Requester</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Current step</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {requests.map((request) => (
            <tr key={request.id}>
              <td className="px-4 py-3 font-medium">
                {request.requestType.replaceAll("_", " ")}
              </td>
              <td className="px-4 py-3">{request.requester.name}</td>
              <td className="px-4 py-3">
                <StatusBadge status={request.status} />
              </td>
              <td className="px-4 py-3">{request.currentStepOrder ?? "-"}</td>
              <td className="px-4 py-3">
                {request.createdAt.toLocaleDateString("en-US")}
              </td>
              <td className="px-4 py-3">
                <Button asChild size="sm" variant="outline">
                  <Link href={`${detailBasePath}/${request.id}`}>Open</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
