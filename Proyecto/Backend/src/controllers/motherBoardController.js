import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//Obtner motherboards sin parametros
export const getMotherBoards = async (req, res) => {
  try {
    const motherboards = await prisma.componente.findMany({
      where: { categoria: "Motherboard" },
      select: {
        id_componente: true,
        nombre: true,
        precio: true,
        marca: true,
        averageRating: true,
        url: true,
        imagenUrl: true,
        especificaciones: true,
      },
    });

    // Manejo seguro del JSONB `especificaciones`
    const motherboardsWithDetails = motherboards.map((board) => ({
      id_componente: board.id_componente,
      nombre: board.nombre,
      precio: board.precio,
      marca: board.marca,
      averageRating: board.averageRating,
      url: board.url,
      imagenUrl: board.imagenUrl,
      especificaciones: board.especificaciones, // Mantener objeto completo para frontend
      chipset: board.especificaciones?.["Chipset"] || "N/A",
      memoryType: board.especificaciones?.["Memory Type"] || "N/A",
      memoryMax: board.especificaciones?.["Memory Max"] || "N/A",
      formFactor: board.especificaciones?.["Form Factor"] || "N/A",
      socketCPU: board.especificaciones?.["Socket / CPU"] || "N/A",
    }));

    res.json(motherboardsWithDetails);
  } catch (error) {
    console.error("Error en getMotherBoards:", error);
    res
      .status(500)
      .json({ message: "Error al obtener Motherboards", error: error.message });
  }
};
