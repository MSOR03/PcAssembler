import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const getCompatibleMonitors = async (req, res) => {
  try {
    const { gpuId } = req.body;
    console.log("🔍 GPU ID recibido:", gpuId, "Tipo:", typeof gpuId);

    // Validar que se haya enviado una GPU
    if (!gpuId) {
      console.log("❌ gpuId no proporcionado");
      return res
        .status(400)
        .json({
          error: "gpuId es requerido para buscar monitores compatibles",
        });
    }

    // Verificar que la GPU existe
    const gpuIdNum = Number(gpuId);
    console.log("🔄 Convirtiendo gpuId a número:", gpuId, "->", gpuIdNum);

    const gpu = await prisma.componente.findUnique({
      where: { id_componente: gpuIdNum },
      select: { id_componente: true, especificaciones: true },
    });

    if (!gpu) {
      console.log("❌ GPU no encontrada con ID:", gpuId);
      return res.status(404).json({ error: "GPU no encontrada" });
    }

    console.log("✅ GPU válida encontrada:", gpu.id_componente);

    // Para simplificar, devolver todos los monitores disponibles
    // En una implementación más avanzada, se podría filtrar por resolución,
    // frecuencia de actualización, etc. basada en la GPU
    console.log("🔍 Buscando monitores en la base de datos...");

    try {
      const compatibleMonitors = await prisma.componente.findMany({
        where: {
          categoria: "Monitor"
        },
        select: {
          id_componente: true,
          nombre: true,
          precio: true,
          marca: true,
          especificaciones: true,
          imagenUrl: true,
        },
        orderBy: {
          precio: 'asc'
        }
      });

      console.log(
        "✅ Monitores disponibles encontrados:",
        compatibleMonitors.length
      );

      if (compatibleMonitors.length === 0) {
        console.log("⚠️ No se encontraron monitores en la base de datos");
      } else {
        console.log("📺 Primer monitor encontrado:", compatibleMonitors[0].nombre);
      }

      return res.json(compatibleMonitors);
    } catch (dbError) {
      console.error("❌ Error en la consulta de monitores:", dbError);
      throw dbError;
    }
  } catch (error) {
    console.error("❌ Error en getCompatibleMonitors:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener monitores compatibles" });
  }
};
