/*
  Warnings:

  - You are about to drop the column `images` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "images";

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "reviewId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
