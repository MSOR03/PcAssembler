/*
  Warnings:

  - A unique constraint covering the columns `[token_compartir]` on the table `Ensamble` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Ensamble" ADD COLUMN     "es_publico" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "token_compartir" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Ensamble_token_compartir_key" ON "Ensamble"("token_compartir");
