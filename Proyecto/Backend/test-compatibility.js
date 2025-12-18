import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Script de prueba para verificar la compatibilidad Socket-Chipset

async function testCompatibility() {
  try {
    console.log('🧪 Probando compatibilidad Socket-Chipset\n');

    // Test 1: Verificar que X870 esté en la tabla
    const x870Compat = await prisma.compatibilidadSocketChipset.findMany({
      where: {
        chipset: {
          contains: 'X870'
        }
      }
    });
    console.log('Test 1 - Chipsets X870:');
    console.log(x870Compat);
    console.log('');

    // Test 2: Verificar todos los chipsets AM5
    const am5Chipsets = await prisma.compatibilidadSocketChipset.findMany({
      where: {
        socket: 'AM5'
      }
    });
    console.log('Test 2 - Todos los chipsets AM5:');
    console.log(am5Chipsets.map(c => c.chipset).join(', '));
    console.log('');

    // Test 3: Buscar una motherboard X870
    const x870Board = await prisma.componente.findFirst({
      where: {
        categoria: 'Motherboard',
        especificaciones: {
          path: ['Chipset'],
          string_contains: 'X870'
        }
      },
      select: {
        nombre: true,
        especificaciones: true
      }
    });
    
    if (x870Board) {
      console.log('Test 3 - Motherboard X870 encontrada:');
      console.log(`Nombre: ${x870Board.nombre}`);
      console.log(`Socket: ${x870Board.especificaciones.Socket}`);
      console.log(`Chipset: ${x870Board.especificaciones.Chipset}`);
      console.log('');

      // Test 4: Buscar CPUs compatibles
      const socket = x870Board.especificaciones['Socket / CPU'];
      
      console.log(`Socket extraído: ${socket}`);
      
      if (socket) {
        const cpusCompatibles = await prisma.componente.findMany({
          where: {
            categoria: 'CPU',
            especificaciones: {
              path: ['Socket'],
              equals: socket
            }
          },
          select: {
            nombre: true,
            marca: true,
            precio: true
          },
          orderBy: {
            precio: 'desc'
          },
          take: 5
        });

        console.log(`Test 4 - Top 5 CPUs ${socket} compatibles:`);
        if (cpusCompatibles.length > 0) {
          cpusCompatibles.forEach((cpu, idx) => {
            console.log(`${idx + 1}. ${cpu.marca} ${cpu.nombre} - $${cpu.precio}`);
          });
        } else {
          console.log(`⚠️  No se encontraron CPUs con socket ${socket}`);
        }
      } else {
        console.log('⚠️  Socket no encontrado en especificaciones');
      }
    } else {
      console.log('Test 3 - No se encontró ninguna motherboard X870 en la base de datos');
    }

    console.log('\n✅ Pruebas completadas');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCompatibility();
