/*
  Warnings:

  - You are about to drop the column `title` on the `DailyReports` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `WeeklyReports` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DailyReports" DROP COLUMN "title";

-- AlterTable
ALTER TABLE "WeeklyReports" DROP COLUMN "title";
