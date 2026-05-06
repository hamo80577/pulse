"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  approveRequestAction,
  rejectRequestAction,
  type ApprovalActionState,
} from "../actions";
import { ApprovalActionMessage } from "./action-message";

const initialState: ApprovalActionState = {};

export function DecisionPanel({
  canDecide,
  requestId,
}: {
  canDecide: boolean;
  requestId: string;
}) {
  const [rejectState, rejectAction, isRejecting] = useActionState(
    rejectRequestAction,
    initialState,
  );
  const [approveState, approveAction, isApproving] = useActionState(
    approveRequestAction,
    initialState,
  );

  if (!canDecide) {
    return (
      <p className="text-sm leading-6 text-muted-foreground">
        This request is visible to you, but you are not the active approver.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      <form action={approveAction} className="flex items-center gap-3">
        <input name="requestId" type="hidden" value={requestId} />
        <Button disabled={isApproving} type="submit">
          {isApproving ? "Approving..." : "Approve active step"}
        </Button>
      </form>
      <ApprovalActionMessage state={approveState} />
      <form action={rejectAction} className="grid gap-3">
        <input name="requestId" type="hidden" value={requestId} />
        <Label htmlFor="comment">Rejection comment</Label>
        <textarea
          className="min-h-24 rounded-md border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          id="comment"
          name="comment"
          placeholder="Required for rejection."
        />
        <ApprovalActionMessage state={rejectState} />
        <Button disabled={isRejecting} type="submit" variant="outline">
          {isRejecting ? "Rejecting..." : "Reject request"}
        </Button>
      </form>
    </div>
  );
}
