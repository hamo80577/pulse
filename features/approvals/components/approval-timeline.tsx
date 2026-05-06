import { StatusBadge } from "@/components/ui/status-badge";
import type { ApprovalRequestDetail } from "../queries";

export function ApprovalTimeline({
  steps,
}: {
  steps: ApprovalRequestDetail["steps"];
}) {
  return (
    <ol className="grid gap-3">
      {steps.map((step) => (
        <li
          className="grid gap-2 rounded-md border p-4 md:grid-cols-[4rem_1fr_auto]"
          key={step.id}
        >
          <div className="text-sm font-medium text-muted-foreground">
            Step {step.stepOrder}
          </div>
          <div className="grid gap-1">
            <p className="text-sm font-medium text-foreground">
              {step.approver?.name ?? step.approverRole.replaceAll("_", " ")}
            </p>
            {step.comment ? (
              <p className="text-sm leading-6 text-muted-foreground">{step.comment}</p>
            ) : null}
          </div>
          <StatusBadge status={step.status} />
        </li>
      ))}
    </ol>
  );
}
