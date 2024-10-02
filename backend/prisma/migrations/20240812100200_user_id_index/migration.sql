-- DropIndex
DROP INDEX "Slang_term_idx";

-- CreateIndex
CREATE INDEX "Slang_term_userId_idx" ON "Slang"("term", "userId");
