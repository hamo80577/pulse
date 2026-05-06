import type { ApprovalActionState } from "../actions";

export function ApprovalActionMessage({
  state,
}: {
  state: ApprovalActionState;
}) {
  if (state.error) {
    return (
      <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
        {state.error}
      </p>
    );
  }

  if (state.success) {
    return (
      <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
        {state.success}
      </p>
    );
  }

  return null;
}
