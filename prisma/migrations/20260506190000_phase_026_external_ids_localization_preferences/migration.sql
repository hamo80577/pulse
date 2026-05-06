ALTER TABLE "Chain" ADD COLUMN "orderSystemChainId" TEXT;

ALTER TABLE "Branch" ADD COLUMN "orderSystemBranchId" TEXT;

CREATE UNIQUE INDEX "Chain_orderSystemChainId_key" ON "Chain"("orderSystemChainId");

CREATE UNIQUE INDEX "Branch_orderSystemBranchId_key" ON "Branch"("orderSystemBranchId");
