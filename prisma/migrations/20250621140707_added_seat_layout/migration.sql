/*
  Warnings:

  - Added the required column `seatLayout` to the `theatres` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "theatres" ADD COLUMN     "seatLayout" JSONB NOT NULL;
