-- AlterTable
ALTER TABLE "concert_tickets" ADD COLUMN     "status" TEXT DEFAULT 'verified';

-- AlterTable
ALTER TABLE "train_tickets" ADD COLUMN     "status" TEXT DEFAULT 'verified';
