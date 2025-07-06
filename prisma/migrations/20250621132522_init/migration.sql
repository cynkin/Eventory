-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT,
    "name" VARCHAR(100),
    "role" VARCHAR(20) NOT NULL,
    "balance" DECIMAL DEFAULT 1000,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "google_id" TEXT,
    "profile_pic" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movies" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ageRating" TEXT NOT NULL,
    "genres" TEXT[],
    "image" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "vendor_id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theatres" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "movie_id" UUID NOT NULL,

    CONSTRAINT "theatres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trains" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "train_id" INTEGER NOT NULL,
    "compartments" INTEGER NOT NULL,
    "additional" DOUBLE PRECISION NOT NULL,
    "stations" JSONB NOT NULL,
    "seatLayout" JSONB NOT NULL,
    "vendor_id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "stations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concerts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ageRating" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "details" JSONB NOT NULL,
    "languages" TEXT[],
    "genres" TEXT[],
    "image" TEXT NOT NULL,
    "vendor_id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "concerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "concerts_title_key" ON "concerts"("title");

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theatres" ADD CONSTRAINT "theatres_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trains" ADD CONSTRAINT "trains_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concerts" ADD CONSTRAINT "concerts_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
