/*
  Warnings:

  - You are about to drop the column `slots` on the `shows` table. All the data in the column will be lost.
  - Added the required column `language` to the `shows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seats` to the `shows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `shows` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shows" DROP COLUMN "slots",
ADD COLUMN     "language" TEXT NOT NULL,
ADD COLUMN     "seats" JSONB NOT NULL,
ADD COLUMN     "time" TEXT NOT NULL;
