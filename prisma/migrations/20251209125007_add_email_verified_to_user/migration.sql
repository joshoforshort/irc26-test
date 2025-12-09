-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "images" JSONB;

-- CreateTable
CREATE TABLE "EditToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EditToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EditToken_token_key" ON "EditToken"("token");

-- CreateIndex
CREATE INDEX "EditToken_token_idx" ON "EditToken"("token");

-- CreateIndex
CREATE INDEX "EditToken_expiresAt_idx" ON "EditToken"("expiresAt");

-- AddForeignKey
ALTER TABLE "EditToken" ADD CONSTRAINT "EditToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
