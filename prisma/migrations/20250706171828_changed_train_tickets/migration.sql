/*
  Warnings:

  - Added the required column `from_station` to the `train_tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_station` to the `train_tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "train_tickets" ADD COLUMN     "from_station" JSONB NOT NULL,
ADD COLUMN     "to_station" JSONB NOT NULL;
