CREATE UNIQUE INDEX IF NOT EXISTS "BranchAssignment_one_active_primary_per_user_role"
ON "BranchAssignment" ("userId", "roleAtBranch")
WHERE "status" = 'ACTIVE' AND "isPrimary" = true;

CREATE UNIQUE INDEX IF NOT EXISTS "ManagerRelation_one_active_relation_per_employee_type"
ON "ManagerRelation" ("employeeUserId", "relationType")
WHERE "status" = 'ACTIVE';
