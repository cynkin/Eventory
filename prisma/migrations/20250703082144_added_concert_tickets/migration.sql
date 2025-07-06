-- CreateTable
CREATE TABLE "concert_tickets" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "seats" INTEGER NOT NULL,
    "user_id" UUID NOT NULL,
    "concert_shows_id" UUID NOT NULL,

    CONSTRAINT "concert_tickets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "concert_tickets" ADD CONSTRAINT "concert_tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concert_tickets" ADD CONSTRAINT "concert_tickets_concert_shows_id_fkey" FOREIGN KEY ("concert_shows_id") REFERENCES "concert_shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
