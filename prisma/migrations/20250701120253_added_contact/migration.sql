-- CreateTable
CREATE TABLE "contact" (
    "id" UUID NOT NULL,
    "bio" TEXT,
    "gender" TEXT,
    "date_of_birth" TEXT,
    "mobile_no" TEXT,
    "emergency_email" TEXT,
    "address" TEXT,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
