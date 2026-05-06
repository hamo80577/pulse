"use client";

import type { OrganizationActionState } from "../actions";

export function ActionMessage({ state }: { state: OrganizationActionState }) {
  if (!state.error && !state.success) {
    return null;
  }

  return (
    <p
      className={
        state.error
          ? "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          : "rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary"
      }
    >
      {state.error ?? state.success}
    </p>
  );
}
