/*
  Warnings:

  - You are about to drop the column `searchCount` on the `Slang` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Slang" DROP COLUMN "searchCount",
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;
