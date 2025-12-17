//Function to get the case compatible with a motherboard and PSU.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCompatibleCases = async (req, res) => {
  try {
    const { motherboardId, gpuId, psuId } = req.body;
    console.log("🔍 Datos recibidos en req.body:", req.body);

    // Verificar que al menos la motherboard esté presente
    if (!motherboardId) {
      return res.status(400).json({ message: "❌ Se requiere motherboard para buscar gabinetes compatibles" });
    }

    // Obtener los componentes de la base de datos
    const [motherboard, gpu, psu, cases] = await Promise.all([
      prisma.componente.findUnique({
        where: { id_componente: motherboardId },
        select: { especificaciones: true },
      }),
      gpuId ? prisma.componente.findUnique({
        where: { id_componente: gpuId },
        select: { especificaciones: true },
      }) : Promise.resolve(null),
      psuId ? prisma.componente.findUnique({
        where: { id_componente: psuId },
        select: { especificaciones: true },
      }) : Promise.resolve(null),
      prisma.componente.findMany({
        where: { categoria: "Case" },
        select: {
          id_componente: true,
          nombre: true,
          marca: true,
          precio: true,
          averageRating: true,
          imagenUrl: true,
          especificaciones: true,
        },
      }),
    ]);

    // Verificar si la motherboard fue encontrada (requerida)
    if (!motherboard)
      return res.status(404).json({ message: "❌ Motherboard no encontrada" });

    // Obtener especificaciones clave
    const motherboardFormFactor =
      motherboard.especificaciones?.["Form Factor"] || "";
    const gpuMaxLength = gpu ?
      parseInt(gpu.especificaciones?.["Length"]?.replace(" mm", ""), 10) || 0 : 0;
    const psuFormFactor = psu ? psu.especificaciones?.["Type"] || "" : "";

    console.log(`Factor de forma de la motherboard: ${motherboardFormFactor}`);
    console.log(`Longitud de la GPU: ${gpuMaxLength} mm`);
    console.log(`Factor de forma de la PSU: ${psuFormFactor}`);

    // Filtrar gabinetes compatibles
    const compatibleCases = cases.filter((pcCase) => {
      const supportedFormFactors =
        pcCase.especificaciones?.["Motherboard Form Factor"] || [];

      // Verificar compatibilidad con motherboard (siempre requerida)
      const motherboardCompatible = supportedFormFactors.includes(motherboardFormFactor);

      // Verificar compatibilidad con GPU (opcional)
      let gpuCompatible = true;
      if (gpu && gpuMaxLength > 0) {
        const maxGpuLengthRaw =
          pcCase.especificaciones?.["Maximum Video Card Length"];
        const maxGpuLength =
          maxGpuLengthRaw && typeof maxGpuLengthRaw === "string"
            ? parseInt(maxGpuLengthRaw.split(" mm")[0], 10)
            : Infinity;
        gpuCompatible = gpuMaxLength <= maxGpuLength;
      }

      // Verificar compatibilidad con PSU (opcional)
      let psuCompatible = true;
      if (psu && psuFormFactor) {
        const caseType = pcCase?.especificaciones?.["Type"] || "";
        const caseSupportsATXPSU = caseType.includes("ATX");
        const caseSupportsSFXPSU =
          caseType.includes("SFX") || caseType.includes("Mini ITX");

        psuCompatible =
          (psuFormFactor === "ATX" && caseSupportsATXPSU) ||
          (psuFormFactor.includes("SFX") && caseSupportsSFXPSU);
      }

      return motherboardCompatible && gpuCompatible && psuCompatible;
    });

    console.log(
      `✅ Gabinetes compatibles encontrados: ${compatibleCases.length}`
    );

    res.json(compatibleCases);
  } catch (error) {
    console.error("❌ Error en getCompatibleCases:", error);
    res.status(500).json({
      message: `Error al obtener gabinetes compatibles: ${error.message}`,
    });
  }
};
