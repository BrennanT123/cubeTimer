/*
  Warnings:

  - Made the column `dnf` on table `Solves` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plustTwo` on table `Solves` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Solves" ALTER COLUMN "dnf" SET NOT NULL,
ALTER COLUMN "dnf" SET DEFAULT false,
ALTER COLUMN "plustTwo" SET NOT NULL,
ALTER COLUMN "plustTwo" SET DEFAULT false;
