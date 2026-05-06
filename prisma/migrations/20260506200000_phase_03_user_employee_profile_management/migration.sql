CREATE TYPE "EmploymentStatus" AS ENUM ('ACTIVE', 'ON_LEAVE', 'ON_HOLD', 'RESIGNED', 'TERMINATED');

CREATE TABLE "EmployeeProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nationalId" TEXT,
    "shopperId" TEXT,
    "ibsId" TEXT,
    "address" TEXT,
    "personalPhotoUrl" TEXT,
    "idCardFrontUrl" TEXT,
    "idCardBackUrl" TEXT,
    "hireDate" TIMESTAMP(3),
    "employmentStatus" "EmploymentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EmployeeProfile_userId_key" ON "EmployeeProfile"("userId");

CREATE UNIQUE INDEX "EmployeeProfile_nationalId_key" ON "EmployeeProfile"("nationalId");

CREATE UNIQUE INDEX "EmployeeProfile_shopperId_key" ON "EmployeeProfile"("shopperId");

CREATE UNIQUE INDEX "EmployeeProfile_ibsId_key" ON "EmployeeProfile"("ibsId");

CREATE INDEX "EmployeeProfile_employmentStatus_idx" ON "EmployeeProfile"("employmentStatus");

ALTER TABLE "EmployeeProfile" ADD CONSTRAINT "EmployeeProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
