/*
  Warnings:

  - The primary key for the `concert_shows` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `concerts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `concert_id` to the `concert_shows` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `concert_shows` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `concerts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "concert_shows" DROP CONSTRAINT "concert_shows_pkey",
ADD COLUMN     "concert_id" UUID NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "concert_shows_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "concerts" DROP CONSTRAINT "concerts_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "concerts_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "concert_shows" ADD CONSTRAINT "concert_shows_concert_id_fkey" FOREIGN KEY ("concert_id") REFERENCES "concerts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
