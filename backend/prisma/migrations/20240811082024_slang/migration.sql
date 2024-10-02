/*
  Warnings:

  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET NOT NULL;

-- CreateTable
CREATE TABLE "Slang" (
    "id" SERIAL NOT NULL,
    "term" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "origin" TEXT NOT NULL DEFAULT 'Internet Slang',
    "searchCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Slang_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Slang_term_key" ON "Slang"("term");

-- CreateIndex
CREATE INDEX "Slang_term_idx" ON "Slang"("term");

-- AddForeignKey
ALTER TABLE "Slang" ADD CONSTRAINT "Slang_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
