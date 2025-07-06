/*
  Warnings:

  - The primary key for the `shows` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `SeatHold` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `id` on the `shows` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "shows" DROP CONSTRAINT "shows_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "shows_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "SeatHold";

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "seats" TEXT[],
    "user_id" UUID NOT NULL,
    "show_id" UUID NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
