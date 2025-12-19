-- AlterTable
ALTER TABLE "Ensamble" ADD COLUMN     "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "EvaluacionIA" (
    "id_evaluacion" SERIAL NOT NULL,
    "id_ensamble" INTEGER NOT NULL,
    "puntuacion_general" DOUBLE PRECISION,
    "resumen" TEXT,
    "puntos_fuertes" JSONB,
    "puntos_debiles" JSONB,
    "compatibilidad" JSONB,
    "balance" JSONB,
    "uso_recomendado" JSONB,
    "recomendaciones" JSONB,
    "conflictos" JSONB,
    "precio_valor" TEXT,
    "fecha_evaluacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvaluacionIA_pkey" PRIMARY KEY ("id_evaluacion")
);

-- CreateIndex
CREATE UNIQUE INDEX "EvaluacionIA_id_ensamble_key" ON "EvaluacionIA"("id_ensamble");

-- AddForeignKey
ALTER TABLE "EvaluacionIA" ADD CONSTRAINT "EvaluacionIA_id_ensamble_fkey" FOREIGN KEY ("id_ensamble") REFERENCES "Ensamble"("id_ensamble") ON DELETE CASCADE ON UPDATE CASCADE;
