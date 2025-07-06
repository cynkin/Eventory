/*
  Warnings:

  - Added the required column `commision` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "commision" DOUBLE PRECISION NOT NULL;
