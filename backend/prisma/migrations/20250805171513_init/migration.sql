/*
  Warnings:

  - You are about to drop the column `plustTwo` on the `Solves` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Solves" DROP COLUMN "plustTwo",
ADD COLUMN     "plusTwo" BOOLEAN NOT NULL DEFAULT false;
