import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Obtener discos compatibles con una motherboard (Recibe el ID de la Motherboard)
export const getDisksCompatibles = async (req, res) => {
  try {
    const { motherboardId, cpuId, gpuId, ramId } = req.body;

    // Validar que los IDs sean números
    if (
      !motherboardId ||
      typeof motherboardId !== "number" ||
      !cpuId ||
      typeof cpuId !== "number" ||
      !gpuId ||
      typeof gpuId !== "number" ||
      !ramId ||
      typeof ramId !== "number"
    ) {
      return res
        .status(400)
        .json({ message: "❌ IDs de motherboard, CPU, GPU y RAM no válidos" });
    }

    // Obtener la motherboard y sus especificaciones
    const motherboard = await prisma.componente.findUnique({
      where: { id_componente: motherboardId },
      select: {
        categoria: true,
        especificaciones: true,
      },
    });

    if (!motherboard) {
      return res.status(404).json({ message: "❌ Motherboard no encontrada" });
    }

    if (motherboard.categoria !== "Motherboard") {
      return res
        .status(400)
        .json({ message: "❌ El ID proporcionado no es de una motherboard" });
    }

    // Extraer los slots M.2 y SATA disponibles
    const m2SlotsRaw = motherboard.especificaciones?.["M.2 Slots"] || [];
    const sataSlots = motherboard.especificaciones?.["SATA 6.0 Gb/s"] || 0;

    // Convertir los slots M.2 en una lista de factores de forma permitidos (2242, 2260, 2280, etc.)
    // Manejar tanto arrays como strings
    const m2Slots = Array.isArray(m2SlotsRaw) 
      ? m2SlotsRaw.flatMap((slot) => slot.match(/\d{4}/g) || [])
      : (typeof m2SlotsRaw === 'string' ? (m2SlotsRaw.match(/\d{4}/g) || []) : []);

    console.log("M.2 Slots compatibles:", m2Slots);
    console.log("SATA Slots disponibles:", sataSlots);

    // Obtener todos los discos de almacenamiento
    const allDisks = await prisma.componente.findMany({
      where: { categoria: "Storage" },
      select: {
        id_componente: true,
        nombre: true,
        marca: true,
        precio: true,
        averageRating: true,
        imagenUrl: true,
        especificaciones: true,

      },
    });

    console.log("Discos disponibles antes del filtrado:", allDisks.length);

    // Filtrar discos compatibles
    const compatibleDisks = allDisks.filter((disk) => {
      const diskFormFactor =
        disk.especificaciones?.["Form Factor"]?.replace(/\s+/g, "") || "";
      const diskInterface = disk.especificaciones?.["Interface"] || "";

      // Extraer el número del factor de forma (ej. "M.2 2280" -> "2280")
      const diskSizeMatch = diskFormFactor.match(/(\d{4})$/);
      const diskSize = diskSizeMatch ? diskSizeMatch[0] : null;

      // Verificar compatibilidad M.2
      const isM2Compatible = diskSize && m2Slots.includes(diskSize);
      const isPcieCompatible = diskInterface.includes("PCIe");
      const isNvmeCompatible = diskInterface.includes("NVMe");
      const isSataCompatible = sataSlots > 0 && diskInterface.includes("SATA");

      // Permitir discos M.2 con cualquier interfaz compatible
      const isFinalM2Compatible =
        isM2Compatible &&
        (isPcieCompatible || isNvmeCompatible || isSataCompatible);

      console.log("Disk:", disk.nombre);
      console.log(" - Form Factor:", diskFormFactor);
      console.log(" - Interface:", diskInterface);
      console.log(" - Extracted Size:", diskSize);
      console.log(" - isM2Compatible:", isM2Compatible);
      console.log(" - isFinalM2Compatible:", isFinalM2Compatible);
      console.log(" - isSataCompatible:", isSataCompatible);

      return isFinalM2Compatible || isSataCompatible;
    });

    console.log(
      "Discos compatibles después del filtrado:",
      compatibleDisks.length
    );

    res.json({ compatibleDisks });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "❌ Error al obtener discos compatibles",
      error: error.message,
    });
  }
};
