/*
  Warnings:

  - You are about to drop the column `priorite` on the `ContactUrgence` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[enfantId]` on the table `ContactUrgence` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ContactUrgence" DROP COLUMN "priorite";

-- CreateIndex
CREATE UNIQUE INDEX "ContactUrgence_enfantId_key" ON "ContactUrgence"("enfantId");
