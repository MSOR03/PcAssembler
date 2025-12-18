import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDelete() {
  try {
    console.log("Intentando eliminar ensamble ID: 12");

    // Verificar que el ensamble existe
    const ensamble = await prisma.ensamble.findFirst({
      where: {
        id_ensamble: 12
      },
      include: {
        Ensamble_Componente: true
      }
    });

    console.log("Ensamble encontrado:", ensamble ? "Sí" : "No");

    if (!ensamble) {
      console.log("Ensamble no encontrado");
      return;
    }

    // Usar una transacción para eliminar todo en el orden correcto
    await prisma.$transaction(async (tx) => {
      // Primero eliminar las relaciones Ensamble_Componente
      await tx.ensamble_Componente.deleteMany({
        where: { id_ensamble: 12 }
      });

      console.log("Relaciones Ensamble_Componente eliminadas");

      // Ahora eliminar el ensamble
      await tx.ensamble.delete({
        where: { id_ensamble: 12 }
      });

      console.log("Ensamble eliminado exitosamente");
    });

  } catch (error) {
    console.error("Error al eliminar el ensamble:", error);
    console.error("Detalles del error:", error.message);
    console.error("Stack:", error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testDelete();



