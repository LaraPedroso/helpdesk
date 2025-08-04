/*
  Warnings:

  - The values [tech] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `technicianId` on the `calls` table. All the data in the column will be lost.
  - You are about to drop the `technician_schedules` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `engineerId` to the `calls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('admin', 'engineer', 'customer');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'customer';
COMMIT;

-- DropForeignKey
ALTER TABLE "calls" DROP CONSTRAINT "calls_technicianId_fkey";

-- DropForeignKey
ALTER TABLE "technician_schedules" DROP CONSTRAINT "technician_schedules_userId_fkey";

-- AlterTable
ALTER TABLE "calls" DROP COLUMN "technicianId",
ADD COLUMN     "engineerId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "technician_schedules";

-- CreateTable
CREATE TABLE "engineer_schedules" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "hours" TEXT[],

    CONSTRAINT "engineer_schedules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "calls" ADD CONSTRAINT "calls_engineerId_fkey" FOREIGN KEY ("engineerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engineer_schedules" ADD CONSTRAINT "engineer_schedules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
