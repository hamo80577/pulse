import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { SessionUser } from "@/lib/auth/types";
import { canDecideActiveStep } from "../rules";
import type { ApprovalRequestDetail } from "../queries";
import { ApprovalTimeline } from "./approval-timeline";
import { DecisionPanel } from "./decision-panel";

export function RequestDetail({
  request,
  user,
  showDecisionPanel = false,
}: {
  request: ApprovalRequestDetail;
  user: SessionUser;
  showDecisionPanel?: boolean;
}) {
  const activeStep = request.steps.find((step) => step.status === "ACTIVE");
  const canDecide = activeStep
    ? canDecideActiveStep(
        { id: user.id, role: user.role },
        {
          approverRole: activeStep.approverRole,
          approverUserId: activeStep.approverUserId,
          status: activeStep.status,
        },
      )
    : false;

  return (
    <div className="grid gap-5">
      <SectionCard title="Request Summary">
        <dl className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Type</dt>
            <dd className="font-medium">{request.requestType.replaceAll("_", " ")}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd>
              <StatusBadge status={request.status} />
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Requester</dt>
            <dd className="font-medium">{request.requester.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Current step</dt>
            <dd className="font-medium">{request.currentStepOrder ?? "-"}</dd>
          </div>
        </dl>
      </SectionCard>
      <SectionCard title="Payload">
        <pre className="overflow-auto rounded-md bg-muted p-4 text-xs leading-6">
          {JSON.stringify(request.payloadJson, null, 2)}
        </pre>
      </SectionCard>
      <SectionCard title="Approval Timeline">
        <ApprovalTimeline steps={request.steps} />
      </SectionCard>
      {showDecisionPanel ? (
        <SectionCard title="Decision">
          <DecisionPanel canDecide={canDecide} requestId={request.id} />
        </SectionCard>
      ) : null}
    </div>
  );
}
