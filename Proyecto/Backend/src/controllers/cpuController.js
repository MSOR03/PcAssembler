// Obtener CPUs compatibles con una motherboard recibe el ID de la motherboard
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getCPUsCompatibles = async (req, res) => {
  try {
    const { motherboardId } = req.body;

    // Validar el ID de la motherboard
    if (!motherboardId || typeof motherboardId !== "number") {
      return res
        .status(400)
        .json({ message: "❌ ID de motherboard no válido" });
    }

    // Obtener la motherboard y su socket y chipset
    const motherboard = await prisma.componente.findUnique({
      where: { id_componente: motherboardId },
      select: {
        categoria: true,
        especificaciones: true, // JSONB donde están el socket y el chipset
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

    // Extraer el socket y el chipset de la motherboard
    const socketCPU = motherboard.especificaciones?.["Socket / CPU"];
    const chipset = motherboard.especificaciones?.["Chipset"];

    console.log("Socket CPU:", socketCPU);
    console.log("Chipset:", chipset);

    if (!socketCPU) {
      return res
        .status(400)
        .json({ message: "❌ La motherboard no tiene un socket definido" });
    }

    if (!chipset) {
      return res
        .status(400)
        .json({ message: "❌ La motherboard no tiene un chipset definido" });
    }

    // Buscar los chipsets compatibles para el socket de la motherboard en la tabla de compatibilidad
    const chipsetsCompatibles =
      await prisma.compatibilidadSocketChipset.findMany({
        where: { socket: socketCPU },
        select: { chipset: true },
      });

    console.log("Chipsets compatibles encontrados en tabla:", chipsetsCompatibles);

    // Si no hay chipsets en la tabla para este socket, asumimos compatibilidad directa por socket
    // Esto permite que sockets nuevos funcionen incluso si no están en la tabla aún
    const chipsetsArray = chipsetsCompatibles.map((c) => c.chipset);
    const isChipsetCompatible = chipsetsArray.length === 0 || chipsetsArray.includes(chipset);

    if (!isChipsetCompatible) {
      console.warn(`⚠️ Chipset ${chipset} no encontrado en tabla de compatibilidad para socket ${socketCPU}`);
      return res.status(400).json({
        message: `❌ El chipset ${chipset} no es compatible con procesadores ${socketCPU}. Por favor, verifica la configuración.`,
      });
    }

    console.log(`✅ Chipset ${chipset} es compatible con socket ${socketCPU}`);

    // Buscar CPUs compatibles usando el socket
    const cpusCompatibles = await prisma.componente.findMany({
      where: {
        categoria: "CPU",
        especificaciones: {
          path: ["Socket"],
          equals: socketCPU,
        },
      },
      select: {
        id_componente: true,
        nombre: true,
        marca: true,
        averageRating: true,
        imagenUrl: true,
        precio: true,
        especificaciones: true,
      },
      orderBy: {
        precio: 'desc'
      }
    });

    console.log(`✅ ${cpusCompatibles.length} CPUs compatibles encontrados con socket ${socketCPU} y chipset ${chipset}`);

    res.json({ cpusCompatibles });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "❌ Error al obtener CPUs compatibles",
      error: error.message,
    });
  }
};
