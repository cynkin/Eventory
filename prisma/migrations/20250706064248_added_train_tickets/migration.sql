/*
  Warnings:

  - The primary key for the `trains` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `trains` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "trains" DROP CONSTRAINT "trains_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "trains_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "train_tickets" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "seats" TEXT[],
    "passengers" JSONB NOT NULL,
    "user_id" UUID NOT NULL,
    "train_id" UUID NOT NULL,

    CONSTRAINT "train_tickets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "train_tickets" ADD CONSTRAINT "train_tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "train_tickets" ADD CONSTRAINT "train_tickets_train_id_fkey" FOREIGN KEY ("train_id") REFERENCES "trains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
