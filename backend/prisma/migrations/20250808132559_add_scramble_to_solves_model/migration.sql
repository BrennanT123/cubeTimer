/*
  Warnings:

  - Added the required column `scramble` to the `Solves` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Solves" ADD COLUMN     "scramble" TEXT NOT NULL;
