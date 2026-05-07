UPDATE "Branch"
SET "orderSystemBranchId" = "id"
WHERE "orderSystemBranchId" IS NULL OR btrim("orderSystemBranchId") = '';

DROP INDEX IF EXISTS "Branch_code_key";

ALTER TABLE "Branch"
DROP COLUMN "code",
ALTER COLUMN "orderSystemBranchId" SET NOT NULL;
