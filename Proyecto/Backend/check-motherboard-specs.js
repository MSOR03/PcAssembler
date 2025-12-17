import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMotherboardSpecs() {
  try {
    const motherboards = await prisma.componente.findMany({
      where: { categoria: 'Motherboard' },
      select: {
        id_componente: true,
        nombre: true,
        especificaciones: true
      },
      take: 3 // Solo las primeras 3 para ver
    });

    console.log('🔍 Especificaciones de Motherboards:');
    motherboards.forEach((mb, index) => {
      console.log(`\n📋 Motherboard ${index + 1}: ${mb.nombre}`);
      console.log('Especificaciones:', JSON.stringify(mb.especificaciones, null, 2));

      // Verificar las claves específicas que busca el frontend
      const specs = mb.especificaciones || {};
      console.log('🔍 Búsqueda específica:');
      console.log('  Socket:', specs['Socket'] || specs['CPU Socket'] || 'NO ENCONTRADO');
      console.log('  Chipset:', specs['Chipset'] || specs['Platform Chipset'] || 'NO ENCONTRADO');
      console.log('  Form Factor:', specs['Form Factor'] || 'NO ENCONTRADO');
      console.log('  Memory Slots:', specs['Memory Slots'] || specs['# of Memory Slots'] || 'NO ENCONTRADO');
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkMotherboardSpecs();
