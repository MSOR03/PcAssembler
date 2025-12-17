import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    console.log('🧹 Limpiando base de datos...');

    // Eliminar en orden para respetar las restricciones de clave foránea
    console.log('Eliminando ensambles...');
    await prisma.ensamble_Componente.deleteMany();
    await prisma.ensamble.deleteMany();

    console.log('Eliminando componentes...');
    await prisma.componente.deleteMany();

    console.log('Eliminando usuarios...');
    await prisma.usuario.deleteMany();

    console.log('Eliminando notificaciones...');
    await prisma.notificacion.deleteMany();

    console.log('Eliminando carritos...');
    await prisma.carrito.deleteMany();

    console.log('Eliminando historial de compras...');
    await prisma.historialCompras.deleteMany();

    console.log('Eliminando ensambles top...');
    await prisma.ensambles_Top.deleteMany();

    console.log('Eliminando compatibilidades...');
    await prisma.compatibilidadSocketChipset.deleteMany();

    console.log('✅ Base de datos limpiada completamente');
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
