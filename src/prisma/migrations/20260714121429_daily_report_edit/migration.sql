/*
  Warnings:

  - Added the required column `appResponse` to the `DailyReports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyReports" ADD COLUMN     "appResponse" TEXT NOT NULL;
