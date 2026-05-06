"use client";

import { useActionState } from "react";
import { createBranchAction, updateBranchAction } from "../actions";
import { ActionMessage } from "./action-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ChainOption = {
  id: string;
  name: string;
};

type BranchFormProps = {
  chains: ChainOption[];
  branch?: {
    id: string;
    chainId: string;
    name: string;
    code: string | null;
    address: string | null;
    status: string;
  };
};

const initialState = {};

export function BranchForm({ chains, branch }: BranchFormProps) {
  const [state, formAction, isPending] = useActionState(
    branch ? updateBranchAction : createBranchAction,
    initialState,
  );

  if (chains.length === 0) {
    return (
      <p className="text-sm leading-6 text-muted-foreground">
        Create an active chain before adding branches.
      </p>
    );
  }

  return (
    <form action={formAction} className="grid gap-5">
      {branch ? <input name="branchId" type="hidden" value={branch.id} /> : null}
      <div className="grid gap-2">
        <Label htmlFor="chainId">Chain</Label>
        <select
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
          defaultValue={branch?.chainId ?? chains[0]?.id}
          id="chainId"
          name="chainId"
          required
        >
          {chains.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="name">Branch name</Label>
        <Input
          defaultValue={branch?.name}
          id="name"
          name="name"
          placeholder="Branch name"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="code">Code</Label>
        <Input
          defaultValue={branch?.code ?? ""}
          id="code"
          name="code"
          placeholder="Optional"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Input
          defaultValue={branch?.address ?? ""}
          id="address"
          name="address"
          placeholder="Optional"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <select
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
          defaultValue={branch?.status ?? "ACTIVE"}
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
        {isPending ? "Saving..." : branch ? "Update branch" : "Create branch"}
      </Button>
    </form>
  );
}
