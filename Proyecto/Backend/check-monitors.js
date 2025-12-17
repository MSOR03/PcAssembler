import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMonitors() {
  try {
    const monitors = await prisma.componente.findMany({
      where: { categoria: 'Monitor' },
      select: { id_componente: true, nombre: true, precio: true }
    });
    console.log('Monitores en BD:', monitors.length);
    if (monitors.length > 0) {
      console.log('Primeros 3 monitores:');
      monitors.slice(0, 3).forEach(m => console.log(`- ${m.nombre} (${m.precio})`));
    } else {
      console.log('❌ No hay monitores en la base de datos');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkMonitors();
