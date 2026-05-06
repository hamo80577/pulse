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
      <div className="flex flex-col gap-2.5">
        <Label className="text-[13px] font-medium text-[#1f2937]" htmlFor="password">
          New password
        </Label>
        <Input
          autoComplete="new-password"
          className="h-12 rounded-xl border-[#d5deea] bg-[#f8fafc] px-4 text-[15px] text-[#111827] shadow-none transition-colors focus-visible:ring-[#9db4d0]"
          id="password"
          minLength={6}
          name="password"
          pattern="[a-zA-Z0-9]+"
          required
          type="password"
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <Label
          className="text-[13px] font-medium text-[#1f2937]"
          htmlFor="confirmPassword"
        >
          Confirm password
        </Label>
        <Input
          autoComplete="new-password"
          className="h-12 rounded-xl border-[#d5deea] bg-[#f8fafc] px-4 text-[15px] text-[#111827] shadow-none transition-colors focus-visible:ring-[#9db4d0]"
          id="confirmPassword"
          minLength={6}
          name="confirmPassword"
          pattern="[a-zA-Z0-9]+"
          required
          type="password"
        />
      </div>
      {state.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <Button
        className="mt-1 h-12 rounded-xl bg-[#132238] text-[15px] font-semibold text-white shadow-none hover:bg-[#1c314d]"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Saving..." : "Save password"}
      </Button>
    </form>
  );
}
