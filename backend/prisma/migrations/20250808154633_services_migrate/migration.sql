/*
  Warnings:

  - You are about to drop the column `isActive` on the `services` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CalledService" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "isActive",
ADD COLUMN     "deletedAt" TIMESTAMP(3);
