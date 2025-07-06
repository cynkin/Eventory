/*
  Warnings:

  - You are about to drop the column `commision` on the `movies` table. All the data in the column will be lost.
  - Added the required column `commission` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movies" DROP COLUMN "commision",
ADD COLUMN     "commission" DOUBLE PRECISION NOT NULL;
