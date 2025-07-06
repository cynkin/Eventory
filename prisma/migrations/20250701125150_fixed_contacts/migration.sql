/*
  Warnings:

  - You are about to drop the column `profile_pic` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "contact" ADD COLUMN     "profile_pic" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "profile_pic";
