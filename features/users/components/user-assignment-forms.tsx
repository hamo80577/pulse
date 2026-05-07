"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createBranchAssignmentAction,
  createManagerRelationAction,
} from "@/features/organization/actions";
import { ActionMessage } from "@/features/organization/components/action-message";
import type { UserDetail } from "../queries";

type BranchOption = {
  id: string;
  name: string;
  orderSystemBranchId: string;
  chain: {
    name: string;
    orderSystemChainId: string;
  };
};

type ManagerOption = {
  id: string;
  name: string;
  role: string;
  status: string;
};

type UserAssignmentFormsProps = {
  user: UserDetail;
  branches: BranchOption[];
  managers: ManagerOption[];
};

const initialState = {};

export function UserBranchAssignmentForm({
  user,
  branches,
}: UserAssignmentFormsProps) {
  const [state, formAction, isPending] = useActionState(
    createBranchAssignmentAction,
    initialState,
  );
  const canAssign = user.status === "ACTIVE" && isBranchAssignableRole(user.role);

  if (!canAssign) {
    return (
      <p className="text-sm leading-6 text-muted-foreground">
        Branch assignments are available only for active Pickers and Champs.
      </p>
    );
  }

  if (branches.length === 0) {
    return (
      <p className="text-sm leading-6 text-muted-foreground">
        Add an active branch under an active chain before assigning employees.
      </p>
    );
  }

  return (
    <form action={formAction} className="grid gap-5">
      <EmployeeContext user={user} />
      <input name="userId" type="hidden" value={user.id} />
      <input name="roleAtBranch" type="hidden" value={user.role} />

      <div className="grid gap-2">
        <Label htmlFor="branchId">Branch</Label>
        <select
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
          id="branchId"
          name="branchId"
          required
        >
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {formatBranchLabel(branch)}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-md border px-3 py-2 text-sm">
        Assignment role: <span className="font-medium">{formatRole(user.role)}</span>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="assignmentStartDate">Start date</Label>
        <Input
          defaultValue={new Date().toISOString().slice(0, 10)}
          id="assignmentStartDate"
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
        {isPending ? "Saving..." : "Add branch assignment"}
      </Button>
    </form>
  );
}

export function UserManagerRelationForm({
  user,
  managers,
}: UserAssignmentFormsProps) {
  const [state, formAction, isPending] = useActionState(
    createManagerRelationAction,
    initialState,
  );
  const relationType = getRelationTypeForEmployee(user.role);

  if (user.status !== "ACTIVE" || !relationType) {
    return (
      <p className="text-sm leading-6 text-muted-foreground">
        Manager relations are available only for active Pickers, Champs, and
        Area Managers.
      </p>
    );
  }

  if (managers.length === 0) {
    return (
      <p className="text-sm leading-6 text-muted-foreground">
        No active eligible managers are available for this employee role.
      </p>
    );
  }

  return (
    <form action={formAction} className="grid gap-5">
      <EmployeeContext user={user} />
      <input name="employeeUserId" type="hidden" value={user.id} />
      <input name="relationType" type="hidden" value={relationType} />

      <div className="grid gap-2">
        <Label htmlFor="managerUserId">Manager</Label>
        <select
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
          id="managerUserId"
          name="managerUserId"
          required
        >
          {managers.map((manager) => (
            <option key={manager.id} value={manager.id}>
              {manager.name} ({formatRole(manager.role)})
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="relationStartDate">Start date</Label>
        <Input
          defaultValue={new Date().toISOString().slice(0, 10)}
          id="relationStartDate"
          name="startDate"
          required
          type="date"
        />
      </div>

      <ActionMessage state={state} />
      <Button disabled={isPending} type="submit">
        {isPending ? "Saving..." : "Add manager relation"}
      </Button>
    </form>
  );
}

function EmployeeContext({ user }: { user: UserDetail }) {
  return (
    <div className="rounded-md border px-3 py-2 text-sm">
      <p className="font-medium">{user.name}</p>
      <p className="text-muted-foreground">
        {formatRole(user.role)} / {formatRole(user.status)}
      </p>
    </div>
  );
}

function formatBranchLabel(branch: BranchOption) {
  const ids = [
    `Chain ID ${branch.chain.orderSystemChainId}`,
    `Branch ID ${branch.orderSystemBranchId}`,
  ];

  return `${branch.chain.name} / ${branch.name}${ids.length > 0 ? ` (${ids.join(" / ")})` : ""}`;
}

function formatRole(value: string) {
  return value.replaceAll("_", " ");
}

function isBranchAssignableRole(role: string) {
  return role === "PICKER" || role === "CHAMP";
}

function getRelationTypeForEmployee(role: string) {
  if (role === "PICKER") {
    return "CHAMP_TO_PICKER";
  }

  if (role === "CHAMP") {
    return "AREA_MANAGER_TO_CHAMP";
  }

  if (role === "AREA_MANAGER") {
    return "OPERATIONS_TO_AREA_MANAGER";
  }

  return null;
}
