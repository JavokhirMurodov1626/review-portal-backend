/*
  Warnings:

  - You are about to drop the column `pieceId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the `Piece` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `group` on the `Review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_pieceId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "pieceId",
ADD COLUMN     "productId" INTEGER NOT NULL,
DROP COLUMN "group",
ADD COLUMN     "group" TEXT NOT NULL,
ALTER COLUMN "images" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Piece";

-- DropEnum
DROP TYPE "Group";

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
