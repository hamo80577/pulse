WITH numbered_users AS (
  SELECT
    "id",
    "username",
    ROW_NUMBER() OVER (ORDER BY "createdAt", "id") AS row_number
  FROM "User"
)
UPDATE "User"
SET "phone" = CASE
  WHEN numbered_users."username" = 'superadmin' THEN '01000000000'
  WHEN numbered_users."username" = 'demo.superadmin' THEN '01000000001'
  WHEN numbered_users."username" = 'demo.admin' THEN '01000000002'
  WHEN numbered_users."username" = 'demo.area' THEN '01000000003'
  WHEN numbered_users."username" = 'demo.champ' THEN '01000000004'
  WHEN numbered_users."username" = 'demo.picker' THEN '01000000005'
  ELSE '019' || LPAD(numbered_users.row_number::text, 8, '0')
END
FROM numbered_users
WHERE "User"."id" = numbered_users."id"
  AND ("User"."phone" IS NULL OR BTRIM("User"."phone") = '');

DROP INDEX IF EXISTS "User_username_key";

ALTER TABLE "User"
  DROP COLUMN IF EXISTS "username",
  ALTER COLUMN "phone" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "User_phone_key" ON "User"("phone");
