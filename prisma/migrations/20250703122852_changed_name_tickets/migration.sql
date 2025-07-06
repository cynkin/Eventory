/*
  Warnings:

  - You are about to drop the column `concert_shows_id` on the `concert_tickets` table. All the data in the column will be lost.
  - Added the required column `concert_show_id` to the `concert_tickets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "concert_tickets" DROP CONSTRAINT "concert_tickets_concert_shows_id_fkey";

-- AlterTable
ALTER TABLE "concert_tickets" DROP COLUMN "concert_shows_id",
ADD COLUMN     "concert_show_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "concert_tickets" ADD CONSTRAINT "concert_tickets_concert_show_id_fkey" FOREIGN KEY ("concert_show_id") REFERENCES "concert_shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
