/* eslint-disable no-undef */
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registrarEnsamble = async (req, res) => {
  try {
    // 1️⃣ Obtener y verificar el token del usuario
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token recibido:", token); // 🔍 Verifica el token recibido

    if (!token) {
      return res.status(401).json({ error: "No autorizado" });
    }

    // 2️⃣ Decodificar el token para obtener el ID del usuario
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Datos decodificados del token:", decoded); // 🔍 Verifica el contenido del token

    const userId = decoded.id;
    console.log("ID de usuario extraído:", userId); // 🔍 Verifica que el ID de usuario no sea undefined

    if (!userId) {
      return res.status(400).json({ error: "Error: El ID de usuario no se encontró en el token" });
    }

    // 3️⃣ Obtener los IDs de los 8 componentes desde el body
    const { nombre, componentes } = req.body;
    console.log("Componentes recibidos:", componentes); // 🔍 Verifica el array de componentes

    if (!nombre || !componentes || componentes.length !== 8) {
      return res.status(400).json({ error: "Debes proporcionar un nombre y exactamente 8 componentes" });
    }

    // 4️⃣ Verificar si los componentes existen en la base de datos
    const componentesDB = await prisma.componente.findMany({
      where: { id_componente: { in: componentes } },
      select: { id_componente: true, precio: true },
    });

    console.log("Componentes encontrados en la DB:", componentesDB); // 🔍 Verifica los componentes encontrados

    if (componentesDB.length !== 8) {
      return res.status(400).json({ error: "Uno o más componentes no existen en la base de datos" });
    }

    // 5️⃣ Calcular el costo total de los componentes
    const costoTotal = componentesDB.reduce((sum, c) => sum + c.precio, 0);
    console.log("Costo total calculado:", costoTotal); // 🔍 Verifica el costo total

    // 6️⃣ Crear el ensamble en la base de datos
    const nuevoEnsamble = await prisma.ensamble.create({
      data: {
        nombre,
        id_usuario: userId, // 🔍 Verifica que no sea undefined
        costo_total: costoTotal,
        Ensamble_Componente: {
          create: componentes.map((id_componente) => ({
            Componente: { connect: { id_componente } },
          })),
        },
      },
      include: { Ensamble_Componente: true },
    });

    console.log("Ensamble registrado con éxito:", nuevoEnsamble); // 🔍 Verifica el objeto final creado en Prisma

    res.status(201).json({
      mensaje: "Ensamble registrado con éxito",
      ensamble: nuevoEnsamble,
    });

  } catch (error) {
    console.error("Error al registrar el ensamble:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};




//Obtener ensambles del usuario


export async function obtenerEnsamblesUsuario(req, res) {
  try {
    // Obtener el token del header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Token inválido" });
    }

    // Buscar los ensambles del usuario y cargar los nombres, precios y especificaciones de los componentes
    const ensambles = await prisma.ensamble.findMany({
      where: { id_usuario: decoded.id },
      include: {
        Ensamble_Componente: {
          include: {
            Componente: {
              select: {
                nombre: true,
                categoria: true,
                precio: true,
                especificaciones: true,
                imagenUrl: true,
              },
            },
          },
        },
      },
    });

    // Definir el orden de categorías deseado
    const ordenCategorias = [
      "Motherboard",
      "CPU",
      "Video Card",
      "Memory",
      "Storage",
      "Power Supply",
      "Case",
      "Monitor",
    ];

    // Formatear la respuesta organizando los componentes por categoría
    const ensamblesOrganizados = ensambles.map((ensamble) => {
      const componentesOrdenados = {};
      let costoTotal = 0;

      // Inicializar las categorías en el objeto de salida
      ordenCategorias.forEach((categoria) => {
        componentesOrdenados[categoria] = null;
      });

      // Asignar los componentes según su categoría con toda la información y sumar los precios
      ensamble.Ensamble_Componente.forEach(({ Componente }) => {
        if (ordenCategorias.includes(Componente.categoria)) {
          componentesOrdenados[Componente.categoria] = {
            nombre: Componente.nombre,
            precio: Componente.precio,
            especificaciones: Componente.especificaciones,
            imagenUrl: Componente.imagenUrl,
          };
        }
        costoTotal += Componente.precio; // Sumar el precio del componente
      });

      return {
        id_ensamble: ensamble.id_ensamble,
        nombre_ensamble: ensamble.nombre,
        costo_total: costoTotal.toFixed(2), // Redondear a dos decimales
        componentes: componentesOrdenados,
      };
    });

    return res.status(200).json({ ensambles: ensamblesOrganizados });
  } catch (error) {
    console.error("Error al obtener ensambles:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    await prisma.$disconnect();
  }
}

// Eliminar ensamble
export const eliminarEnsamble = async (req, res) => {
  try {
    console.log("Headers recibidos:", req.headers);
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token extraído:", token ? "Presente" : "Ausente");

    if (!token) {
      return res.status(401).json({ error: "No autorizado" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decodificado:", decoded);
    } catch (jwtError) {
      console.error("Error al verificar token JWT:", jwtError.message);
      return res.status(401).json({ error: "Token inválido" });
    }

    const userId = decoded.id;
    console.log("User ID extraído:", userId);

    if (!userId) {
      return res.status(400).json({ error: "Error: El ID de usuario no se encontró en el token" });
    }

    const { id_ensamble } = req.params;

    if (!id_ensamble) {
      return res.status(400).json({ error: "ID de ensamble requerido" });
    }

    console.log("Intentando eliminar ensamble:", id_ensamble, "para usuario:", userId);

    // Verificar que el ensamble pertenece al usuario
    const ensamble = await prisma.ensamble.findFirst({
      where: {
        id_ensamble: parseInt(id_ensamble)
      },
      include: {
        Ensamble_Componente: true
      }
    });

    console.log("Ensamble encontrado:", ensamble);
    console.log("ID del usuario propietario:", ensamble?.id_usuario);
    console.log("ID del usuario actual:", userId);

    if (!ensamble) {
      return res.status(404).json({ error: "Ensamble no encontrado" });
    }

    if (ensamble.id_usuario !== userId) {
      return res.status(403).json({ error: "No autorizado para eliminar este ensamble" });
    }

    // Usar una transacción para eliminar todo en el orden correcto
    await prisma.$transaction(async (tx) => {
      // Primero eliminar las relaciones Ensamble_Componente
      await tx.Ensamble_Componente.deleteMany({
        where: { id_ensamble: parseInt(id_ensamble) }
      });

      console.log("Relaciones Ensamble_Componente eliminadas");

      // Ahora eliminar el ensamble
      await tx.ensamble.delete({
        where: { id_ensamble: parseInt(id_ensamble) }
      });

      console.log("Ensamble eliminado exitosamente");
    });

    res.status(200).json({ mensaje: "Ensamble eliminado exitosamente" });

  } catch (error) {
    console.error("Error al eliminar el ensamble:", error);
    console.error("Detalles del error:", error.message);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
};

// Modificar ensamble
export const modificarEnsamble = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!userId) {
      return res.status(400).json({ error: "Error: El ID de usuario no se encontró en el token" });
    }

    const { id_ensamble } = req.params;
    const { nombre, componentes } = req.body;

    if (!id_ensamble) {
      return res.status(400).json({ error: "ID de ensamble requerido" });
    }

    // Verificar que el ensamble pertenece al usuario
    const ensambleExistente = await prisma.ensamble.findFirst({
      where: {
        id_ensamble: parseInt(id_ensamble),
        id_usuario: userId
      }
    });

    if (!ensambleExistente) {
      return res.status(404).json({ error: "Ensamble no encontrado o no autorizado" });
    }

    if (nombre && componentes && componentes.length === 8) {
      // Verificar que los componentes existen
      const componentesDB = await prisma.componente.findMany({
        where: { id_componente: { in: componentes } },
        select: { id_componente: true, precio: true },
      });

      if (componentesDB.length !== 8) {
        return res.status(400).json({ error: "Uno o más componentes no existen en la base de datos" });
      }

      const costoTotal = componentesDB.reduce((sum, c) => sum + c.precio, 0);

      // Actualizar el ensamble y sus componentes
      await prisma.ensamble.update({
        where: { id_ensamble: parseInt(id_ensamble) },
        data: {
          nombre,
          costo_total: costoTotal,
          fecha_modificacion: new Date(),
          Ensamble_Componente: {
            deleteMany: {}, // Eliminar relaciones existentes
            create: componentes.map((id_componente) => ({
              Componente: { connect: { id_componente } },
            })),
          },
        },
      });

      // Eliminar evaluación de IA existente (ya no es válida)
      await prisma.evaluacionIA.deleteMany({
        where: { id_ensamble: parseInt(id_ensamble) }
      });
    } else if (nombre) {
      // Solo actualizar el nombre
      await prisma.ensamble.update({
        where: { id_ensamble: parseInt(id_ensamble) },
        data: { nombre },
      });
    } else {
      return res.status(400).json({ error: "Debes proporcionar un nombre o componentes para actualizar" });
    }

    res.status(200).json({ mensaje: "Ensamble actualizado exitosamente" });

  } catch (error) {
    console.error("Error al modificar el ensamble:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};