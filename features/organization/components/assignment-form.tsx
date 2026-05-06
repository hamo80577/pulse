"use client";

import { useActionState } from "react";
import { createBranchAssignmentAction } from "../actions";
import { ActionMessage } from "./action-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AssignmentFormProps = {
  branches: Array<{
    id: string;
    name: string;
    chain: { name: string };
  }>;
  users: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  defaultBranchId?: string;
};

const initialState = {};

export function AssignmentForm({
  branches,
  users,
  defaultBranchId,
}: AssignmentFormProps) {
  const [state, formAction, isPending] = useActionState(
    createBranchAssignmentAction,
    initialState,
  );

  if (branches.length === 0 || users.length === 0) {
    return (
      <p className="text-sm leading-6 text-muted-foreground">
        Assignments require at least one active branch and one active Picker or
        Champ.
      </p>
    );
  }

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="branchId">Branch</Label>
        <select
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
          defaultValue={defaultBranchId ?? branches[0]?.id}
          id="branchId"
          name="branchId"
          required
        >
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.chain.name} / {branch.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="userId">User</Label>
        <select
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
          id="userId"
          name="userId"
          required
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.role.replaceAll("_", " ")})
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="roleAtBranch">Assignment role</Label>
        <select
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
          id="roleAtBranch"
          name="roleAtBranch"
          required
        >
          <option value="PICKER">Picker</option>
          <option value="CHAMP">Champ</option>
        </select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="startDate">Start date</Label>
        <Input
          defaultValue={new Date().toISOString().slice(0, 10)}
          id="startDate"
          name="startDate"
          required
          type="date"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input defaultChecked name="isPrimary" type="checkbox" />
        Primary assignment
      </label>
      <ActionMessage state={state} />
      <Button disabled={isPending} type="submit">
        {isPending ? "Saving..." : "Create assignment"}
      </Button>
    </form>
  );
}
