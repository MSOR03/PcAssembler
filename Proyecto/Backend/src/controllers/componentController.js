/* eslint-disable no-dupe-keys */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTopComponents = async (req, res) => {
  try {
    const categories = [
      "Motherboard",
      "CPU",
      "Video Card",
      "Memory",
      "Storage",
      "Power Supply",
      "Case",
      "Monitor",
    ];

    const results = await Promise.all(
      categories.map(async (category) => {
        return await prisma.componente.findFirst({
          where: {
            categoria: category,
            averageRating: { not: 0, not: null },
            precio: { not: 0 },
            imagenUrl: { not: "default.jpg" },
          },
          orderBy: [
            { averageRating: "desc" },
            { precio: "desc" }, // Ordenar por precio descendente
          ],
        });
      })
    );

    res.json(results);
  } catch (error) {
    console.error("Error al obtener los componentes", error);
    res.status(500).json({ error: "Error al obtener los componentes" });
  }
};

export const getAllComponents = async (req, res) => {
  try {
    const components = await prisma.componente.findMany({
      select: {
        id_componente: true,
        nombre: true,
        categoria: true,
        precio: true,
        marca: true,
        especificaciones: true,
        imagenUrl: true,
        averageRating: true,
      },
      orderBy: {
        precio: 'asc'
      }
    });

    res.json(components);
  } catch (error) {
    console.error("Error al obtener todos los componentes", error);
    res.status(500).json({ error: "Error al obtener los componentes" });
  }
};

// Obtener componente por ID
export const getComponentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de componente requerido" });
    }

    const component = await prisma.componente.findUnique({
      where: {
        id_componente: parseInt(id)
      },
      select: {
        id_componente: true,
        nombre: true,
        categoria: true,
        precio: true,
        marca: true,
        especificaciones: true,
        imagenUrl: true,
        descripcion: true,
        averageRating: true,
        lowestPrice: true
      }
    });

    if (!component) {
      return res.status(404).json({ error: "Componente no encontrado" });
    }

    res.json(component);
  } catch (error) {
    console.error("Error al obtener componente por ID", error);
    res.status(500).json({ error: "Error al obtener el componente" });
  }
};
