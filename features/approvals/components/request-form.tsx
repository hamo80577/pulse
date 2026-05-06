"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createApprovalRequestAction, type ApprovalActionState } from "../actions";
import { ApprovalActionMessage } from "./action-message";

const initialState: ApprovalActionState = {};

export function RequestForm() {
  const [state, formAction, isPending] = useActionState(
    createApprovalRequestAction,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-5">
      <input name="requestType" type="hidden" value="ANNUAL_LEAVE" />
      <div className="grid gap-2">
        <Label htmlFor="leaveDate">Leave date</Label>
        <Input id="leaveDate" name="leaveDate" required type="date" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="reason">Reason</Label>
        <textarea
          className="min-h-28 rounded-md border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          id="reason"
          name="reason"
          placeholder="Briefly describe the request."
          required
        />
      </div>
      <ApprovalActionMessage state={state} />
      <Button disabled={isPending} type="submit">
        {isPending ? "Submitting..." : "Submit request"}
      </Button>
    </form>
  );
}
