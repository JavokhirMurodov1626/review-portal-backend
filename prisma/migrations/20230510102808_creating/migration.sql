/*
  Warnings:

  - A unique constraint covering the columns `[commentId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "commentId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Rating_commentId_key" ON "Rating"("commentId");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
