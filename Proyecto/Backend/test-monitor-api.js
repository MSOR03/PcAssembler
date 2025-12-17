// Script para probar la API de monitores
console.log('🧪 Probando API de monitores...');

// Simular la lógica del controlador
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testLogic() {
  try {
    const gpuId = '17214';
    console.log('🔍 GPU ID recibido:', gpuId, 'Tipo:', typeof gpuId);

    // Verificar que la GPU existe
    const gpuIdNum = Number(gpuId);
    console.log('🔄 Convirtiendo gpuId a número:', gpuId, '->', gpuIdNum);

    const gpu = await prisma.componente.findUnique({
      where: { id_componente: gpuIdNum },
      select: { id_componente: true, especificaciones: true },
    });

    if (!gpu) {
      console.log('❌ GPU no encontrada con ID:', gpuIdNum);
      return;
    }

    console.log('✅ GPU válida encontrada:', gpu.id_componente);

    // Buscar monitores
    console.log('🔍 Buscando monitores en la base de datos...');

    const compatibleMonitors = await prisma.componente.findMany({
      where: {
        categoria: 'Monitor'
      },
      select: {
        id_componente: true,
        nombre: true,
        precio: true,
        marca: true,
        especificaciones: true,
        imagenUrl: true,
      },
      orderBy: {
        precio: 'asc'
      }
    });

    console.log('✅ Monitores encontrados:', compatibleMonitors.length);

    if (compatibleMonitors.length > 0) {
      console.log('📺 Primer monitor:', compatibleMonitors[0].nombre);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testLogic();
