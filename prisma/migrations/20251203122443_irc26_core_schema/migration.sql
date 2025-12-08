/*
  Warnings:

  - You are about to drop the column `approxLocations` on the `Pledge` table. All the data in the column will be lost.
  - You are about to drop the column `cacheSizes` on the `Pledge` table. All the data in the column will be lost.
  - You are about to drop the column `cacheTypes` on the `Pledge` table. All the data in the column will be lost.
  - You are about to drop the column `ideaNotes` on the `Pledge` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrls` on the `Pledge` table. All the data in the column will be lost.
  - You are about to drop the column `pledgedCount` on the `Pledge` table. All the data in the column will be lost.
  - You are about to drop the column `states` on the `Pledge` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Pledge` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Confirmation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EditToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `approxState` to the `Pledge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `approxSuburb` to the `Pledge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cacheSize` to the `Pledge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cacheType` to the `Pledge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gcUsername` to the `Pledge` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CacheType" AS ENUM ('TRADITIONAL', 'MULTI', 'MYSTERY', 'LETTERBOX', 'WHERIGO', 'VIRTUAL');

-- CreateEnum
CREATE TYPE "CacheSize" AS ENUM ('NANO', 'MICRO', 'SMALL', 'REGULAR', 'LARGE', 'OTHER');

-- CreateEnum
CREATE TYPE "AUState" AS ENUM ('ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA');

-- CreateEnum
CREATE TYPE "PledgeStatus" AS ENUM ('CONCEPT', 'HIDDEN');

-- DropForeignKey
ALTER TABLE "Confirmation" DROP CONSTRAINT "Confirmation_pledgeId_fkey";

-- DropForeignKey
ALTER TABLE "Confirmation" DROP CONSTRAINT "Confirmation_userId_fkey";

-- DropForeignKey
ALTER TABLE "EditToken" DROP CONSTRAINT "EditToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "Pledge" DROP CONSTRAINT "Pledge_userId_fkey";

-- AlterTable
ALTER TABLE "Pledge" DROP COLUMN "approxLocations",
DROP COLUMN "cacheSizes",
DROP COLUMN "cacheTypes",
DROP COLUMN "ideaNotes",
DROP COLUMN "photoUrls",
DROP COLUMN "pledgedCount",
DROP COLUMN "states",
DROP COLUMN "updatedAt",
ADD COLUMN     "approxState" "AUState" NOT NULL,
ADD COLUMN     "approxSuburb" TEXT NOT NULL,
ADD COLUMN     "cacheSize" "CacheSize" NOT NULL,
ADD COLUMN     "cacheType" "CacheType" NOT NULL,
ADD COLUMN     "conceptNotes" TEXT,
ADD COLUMN     "gcUsername" TEXT NOT NULL,
ADD COLUMN     "images" JSONB,
ADD COLUMN     "status" "PledgeStatus" NOT NULL DEFAULT 'CONCEPT',
ADD COLUMN     "title" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt",
DROP COLUMN "username",
ADD COLUMN     "gcUsername" TEXT;

-- DropTable
DROP TABLE "Confirmation";

-- DropTable
DROP TABLE "EditToken";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "pledgeId" TEXT NOT NULL,
    "userId" TEXT,
    "gcUsername" TEXT NOT NULL,
    "gcCode" TEXT NOT NULL,
    "cacheName" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "state" "AUState" NOT NULL,
    "difficulty" DOUBLE PRECISION NOT NULL,
    "terrain" DOUBLE PRECISION NOT NULL,
    "type" "CacheType" NOT NULL,
    "hiddenDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "actorEmail" TEXT,
    "action" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetKind" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_pledgeId_key" ON "Submission"("pledgeId");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_gcCode_key" ON "Submission"("gcCode");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pledge" ADD CONSTRAINT "Pledge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_pledgeId_fkey" FOREIGN KEY ("pledgeId") REFERENCES "Pledge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
