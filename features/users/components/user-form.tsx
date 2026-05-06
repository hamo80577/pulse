"use client";

import { useActionState } from "react";
import { createUserAction, updateUserAndProfileAction } from "../actions";
import type { UserDetail } from "../queries";
import { UserActionMessage } from "./action-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { roles, userStatuses } from "@/lib/auth/types";
import { employmentStatuses } from "@/lib/validation/users";

const initialState = {};

export function UserForm({ user }: { user?: UserDetail }) {
  const [state, formAction, isPending] = useActionState(
    user ? updateUserAndProfileAction : createUserAction,
    initialState,
  );
  const profile = user?.employeeProfile;

  return (
    <form action={formAction} className="grid gap-5">
      {user ? <input name="userId" type="hidden" value={user.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" name="name" required value={user?.name} />
        <Field label="Phone" name="phone" required type="tel" value={user?.phone} />
        <Field label="Email" name="email" type="email" value={user?.email} />
        <SelectField
          label="Role"
          name="role"
          options={roles.map((role) => [role, role.replaceAll("_", " ")])}
          value={user?.role ?? "PICKER"}
        />
        <SelectField
          label="Account Status"
          name="status"
          options={userStatuses.map((status) => [status, status.replaceAll("_", " ")])}
          value={user?.status ?? "PENDING_SETUP"}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="National ID" name="nationalId" value={profile?.nationalId} />
        <Field label="Shopper ID" name="shopperId" value={profile?.shopperId} />
        <Field label="IBS ID" name="ibsId" value={profile?.ibsId} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Address" name="address" value={profile?.address} />
        <Field
          label="Hire Date"
          name="hireDate"
          type="date"
          value={profile?.hireDate?.toISOString().slice(0, 10)}
        />
        <SelectField
          label="Employment Status"
          name="employmentStatus"
          options={employmentStatuses.map((status) => [
            status,
            status.replaceAll("_", " "),
          ])}
          value={profile?.employmentStatus ?? "ACTIVE"}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field
          label="Personal Photo URL"
          name="personalPhotoUrl"
          value={profile?.personalPhotoUrl}
        />
        <Field
          label="ID Card Front URL"
          name="idCardFrontUrl"
          value={profile?.idCardFrontUrl}
        />
        <Field
          label="ID Card Back URL"
          name="idCardBackUrl"
          value={profile?.idCardBackUrl}
        />
      </div>

      <UserActionMessage state={state} />
      <Button disabled={isPending} type="submit">
        {isPending ? "Saving..." : user ? "Update user" : "Create user"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value?: string | null;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        defaultValue={value ?? ""}
        id={name}
        name={name}
        required={required}
        type={type}
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  options,
}: {
  label: string;
  name: string;
  value: string;
  options: string[][];
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <select
        className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
        defaultValue={value}
        id={name}
        name={name}
      >
        {options.map(([optionValue, labelText]) => (
          <option key={optionValue} value={optionValue}>
            {labelText}
          </option>
        ))}
      </select>
    </div>
  );
}
