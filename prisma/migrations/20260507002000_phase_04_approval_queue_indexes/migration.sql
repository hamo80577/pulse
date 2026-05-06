CREATE INDEX "ApprovalRequest_status_createdAt_idx"
ON "ApprovalRequest"("status", "createdAt");

CREATE INDEX "ApprovalRequest_requesterId_createdAt_idx"
ON "ApprovalRequest"("requesterId", "createdAt");

CREATE INDEX "ApprovalStep_status_approverRole_idx"
ON "ApprovalStep"("status", "approverRole");

CREATE INDEX "ApprovalStep_status_approverUserId_idx"
ON "ApprovalStep"("status", "approverUserId");
