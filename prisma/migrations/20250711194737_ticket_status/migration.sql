-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "status" TEXT DEFAULT 'verified';

-- CreateTable
CREATE TABLE "SeatHold" (
    "id" TEXT NOT NULL,
    "seatCode" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeatHold_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeatHold_seatCode_slotId_key" ON "SeatHold"("seatCode", "slotId");
