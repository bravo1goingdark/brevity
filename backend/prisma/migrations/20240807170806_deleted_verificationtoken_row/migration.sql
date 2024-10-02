/*
  Warnings:

  - You are about to drop the column `verificationToken` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_username_email_verificationToken_idx";

-- DropIndex
DROP INDEX "User_verificationToken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "verificationToken";

-- CreateIndex
CREATE INDEX "User_username_email_idx" ON "User"("username", "email");
