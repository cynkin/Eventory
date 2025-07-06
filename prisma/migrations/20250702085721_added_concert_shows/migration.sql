/*
  Warnings:

  - You are about to drop the column `details` on the `concerts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "concerts" DROP COLUMN "details";

-- CreateTable
CREATE TABLE "concert_shows" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,

    CONSTRAINT "concert_shows_pkey" PRIMARY KEY ("id")
);
