"use client";

import { useActionState } from "react";
import { createChainAction, updateChainAction } from "../actions";
import { ActionMessage } from "./action-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState = {};

type ChainFormProps = {
  chain?: {
    id: string;
    name: string;
    code: string | null;
    status: string;
  };
};

export function ChainForm({ chain }: ChainFormProps) {
  const [state, formAction, isPending] = useActionState(
    chain ? updateChainAction : createChainAction,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-5">
      {chain ? <input name="chainId" type="hidden" value={chain.id} /> : null}
      <div className="grid gap-2">
        <Label htmlFor="name">Chain name</Label>
        <Input
          defaultValue={chain?.name}
          id="name"
          name="name"
          placeholder="Chain name"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="code">Code</Label>
        <Input
          defaultValue={chain?.code ?? ""}
          id="code"
          name="code"
          placeholder="Optional code"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <select
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
          defaultValue={chain?.status ?? "ACTIVE"}
          id="status"
          name="status"
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>
      <ActionMessage state={state} />
      <Button disabled={isPending} type="submit">
        {isPending ? "Saving..." : chain ? "Update chain" : "Create chain"}
      </Button>
    </form>
  );
}
