/*
  Warnings:

  - The primary key for the `theatres` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `details` on the `theatres` table. All the data in the column will be lost.
  - Added the required column `vendor_id` to the `theatres` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `theatres` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "theatres" DROP CONSTRAINT "theatres_pkey",
DROP COLUMN "details",
ADD COLUMN     "vendor_id" UUID NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "theatres_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "shows" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "slots" JSONB NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "premium_cost" DOUBLE PRECISION NOT NULL,
    "theatre_id" UUID NOT NULL,
    "movie_id" UUID NOT NULL,

    CONSTRAINT "shows_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "theatres" ADD CONSTRAINT "theatres_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "shows_theatre_id_fkey" FOREIGN KEY ("theatre_id") REFERENCES "theatres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "shows_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
