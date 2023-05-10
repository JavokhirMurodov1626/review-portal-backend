/*
  Warnings:

  - You are about to drop the column `commentId` on the `Rating` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_commentId_fkey";

-- DropIndex
DROP INDEX "Rating_commentId_key";

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "commentId";
