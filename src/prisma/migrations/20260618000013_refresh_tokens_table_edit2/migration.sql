/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `RefreshTokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `RefreshTokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RefreshTokens" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshTokens_email_key" ON "RefreshTokens"("email");
