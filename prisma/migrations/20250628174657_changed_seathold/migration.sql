/*
  Warnings:

  - A unique constraint covering the columns `[seatCode,slotId]` on the table `SeatHold` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SeatHold_seatCode_slotId_key" ON "SeatHold"("seatCode", "slotId");
