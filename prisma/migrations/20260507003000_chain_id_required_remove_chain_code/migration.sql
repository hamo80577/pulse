UPDATE "Chain"
SET "orderSystemChainId" = "id"
WHERE "orderSystemChainId" IS NULL OR btrim("orderSystemChainId") = '';

DROP INDEX IF EXISTS "Chain_code_key";

ALTER TABLE "Chain"
DROP COLUMN "code",
ALTER COLUMN "orderSystemChainId" SET NOT NULL;
