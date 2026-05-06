CREATE TYPE "ApprovalRequestType" AS ENUM (
  'ANNUAL_LEAVE',
  'ADD_PICKER',
  'ADD_CHAMP',
  'TRANSFER_PICKER_SAME_CHAIN',
  'TRANSFER_PICKER_CROSS_CHAIN',
  'RESIGNATION',
  'EMPLOYEE_DATA_UPDATE'
);

CREATE TYPE "ApprovalRequestStatus" AS ENUM (
  'DRAFT',
  'SUBMITTED',
  'PENDING',
  'APPROVED',
  'REJECTED',
  'CANCELLED',
  'EXPIRED'
);

CREATE TYPE "ApprovalStepStatus" AS ENUM (
  'WAITING',
  'ACTIVE',
  'APPROVED',
  'REJECTED',
  'SKIPPED'
);

CREATE TYPE "ApprovalDecision" AS ENUM (
  'APPROVED',
  'REJECTED'
);

CREATE TYPE "NotificationType" AS ENUM (
  'REQUEST_SUBMITTED',
  'APPROVAL_REQUIRED',
  'REQUEST_APPROVED',
  'REQUEST_REJECTED',
  'REQUEST_CANCELLED',
  'REQUEST_COMPLETED'
);

CREATE TABLE "ApprovalRequest" (
  "id" TEXT NOT NULL,
  "requestType" "ApprovalRequestType" NOT NULL,
  "requesterId" TEXT NOT NULL,
  "targetUserId" TEXT,
  "status" "ApprovalRequestStatus" NOT NULL DEFAULT 'PENDING',
  "currentStepOrder" INTEGER,
  "payloadJson" JSONB NOT NULL,
  "submittedAt" TIMESTAMP(3),
  "finalDecisionAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ApprovalStep" (
  "id" TEXT NOT NULL,
  "requestId" TEXT NOT NULL,
  "stepOrder" INTEGER NOT NULL,
  "approverRole" "Role" NOT NULL,
  "approverUserId" TEXT,
  "status" "ApprovalStepStatus" NOT NULL DEFAULT 'WAITING',
  "decision" "ApprovalDecision",
  "comment" TEXT,
  "decidedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ApprovalStep_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Notification" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "type" "NotificationType" NOT NULL,
  "linkUrl" TEXT,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "readAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ApprovalStep_requestId_stepOrder_key"
ON "ApprovalStep"("requestId", "stepOrder");

CREATE INDEX "ApprovalRequest_requesterId_idx" ON "ApprovalRequest"("requesterId");
CREATE INDEX "ApprovalRequest_targetUserId_idx" ON "ApprovalRequest"("targetUserId");
CREATE INDEX "ApprovalRequest_requestType_idx" ON "ApprovalRequest"("requestType");
CREATE INDEX "ApprovalRequest_status_idx" ON "ApprovalRequest"("status");
CREATE INDEX "ApprovalRequest_createdAt_idx" ON "ApprovalRequest"("createdAt");

CREATE INDEX "ApprovalStep_requestId_idx" ON "ApprovalStep"("requestId");
CREATE INDEX "ApprovalStep_status_idx" ON "ApprovalStep"("status");
CREATE INDEX "ApprovalStep_approverRole_idx" ON "ApprovalStep"("approverRole");
CREATE INDEX "ApprovalStep_approverUserId_idx" ON "ApprovalStep"("approverUserId");

CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");
CREATE INDEX "Notification_type_idx" ON "Notification"("type");
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

ALTER TABLE "ApprovalRequest"
ADD CONSTRAINT "ApprovalRequest_requesterId_fkey"
FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ApprovalRequest"
ADD CONSTRAINT "ApprovalRequest_targetUserId_fkey"
FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ApprovalStep"
ADD CONSTRAINT "ApprovalStep_requestId_fkey"
FOREIGN KEY ("requestId") REFERENCES "ApprovalRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ApprovalStep"
ADD CONSTRAINT "ApprovalStep_approverUserId_fkey"
FOREIGN KEY ("approverUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Notification"
ADD CONSTRAINT "Notification_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
