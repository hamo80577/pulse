"use client";

import { useActionState } from "react";
import { createManagerRelationAction } from "../actions";
import { ActionMessage } from "./action-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ManagerRelationFormProps = {
  users: Array<{
    id: string;
    name: string;
    role: string;
  }>;
};

const initialState = {};

export function ManagerRelationForm({ users }: ManagerRelationFormProps) {
  const [state, formAction, isPending] = useActionState(
    createManagerRelationAction,
    initialState,
  );

  if (users.length < 2) {
    return (
      <p className="text-sm leading-6 text-muted-foreground">
        Manager relations require eligible active users. User creation begins in
        the user management phase.
      </p>
    );
  }

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="relationType">Relation type</Label>
        <select
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
          id="relationType"
          name="relationType"
          required
        >
          <option value="CHAMP_TO_PICKER">Champ to Picker</option>
          <option value="AREA_MANAGER_TO_CHAMP">Area Manager to Champ</option>
          <option value="OPERATIONS_TO_AREA_MANAGER">
            Operations to Area Manager
          </option>
        </select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="employeeUserId">Employee</Label>
        <select
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
          id="employeeUserId"
          name="employeeUserId"
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
        <Label htmlFor="managerUserId">Manager</Label>
        <select
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
          id="managerUserId"
          name="managerUserId"
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
        <Label htmlFor="startDate">Start date</Label>
        <Input
          defaultValue={new Date().toISOString().slice(0, 10)}
          id="startDate"
          name="startDate"
          required
          type="date"
        />
      </div>
      <ActionMessage state={state} />
      <Button disabled={isPending} type="submit">
        {isPending ? "Saving..." : "Create relation"}
      </Button>
    </form>
  );
}
