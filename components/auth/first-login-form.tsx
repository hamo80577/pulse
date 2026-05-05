"use client";

import { useActionState } from "react";
import {
  completeFirstLoginAction,
  type AuthActionState,
} from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = {};

export function FirstLoginForm({ token }: { token?: string }) {
  const [state, formAction, isPending] = useActionState(
    completeFirstLoginAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input name="token" type="hidden" value={token ?? ""} />
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">New password</Label>
        <Input
          autoComplete="new-password"
          id="password"
          name="password"
          required
          type="password"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          autoComplete="new-password"
          id="confirmPassword"
          name="confirmPassword"
          required
          type="password"
        />
      </div>
      {state.error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      <Button disabled={isPending} type="submit">
        {isPending ? "Saving..." : "Save password"}
      </Button>
    </form>
  );
}
