"use client";

import { useActionState } from "react";
import { loginAction, type AuthActionState } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2.5">
        <Label className="text-[13px] font-medium text-[#1f2937]" htmlFor="phone">
          Phone
        </Label>
        <Input
          autoComplete="tel"
          className="h-12 rounded-xl border-[#d5deea] bg-[#f8fafc] px-4 text-[15px] text-[#111827] shadow-none transition-colors placeholder:text-[#94a3b8] focus-visible:ring-[#9db4d0]"
          id="phone"
          name="phone"
          placeholder="01000000000"
          required
          type="tel"
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-[13px] font-medium text-[#1f2937]" htmlFor="password">
          Password
        </Label>
        <Input
          autoComplete="current-password"
          className="h-12 rounded-xl border-[#d5deea] bg-[#f8fafc] px-4 text-[15px] text-[#111827] shadow-none transition-colors focus-visible:ring-[#9db4d0]"
          id="password"
          name="password"
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
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
