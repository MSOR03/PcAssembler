import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyClean() {
  try {
    const componentCount = await prisma.componente.count();
    const userCount = await prisma.usuario.count();

    console.log('🧹 Estado de la base de datos después de limpieza:');
    console.log('📦 Componentes:', componentCount);
    console.log('👥 Usuarios:', userCount);

    if (componentCount === 0 && userCount === 0) {
      console.log('✅ Base de datos completamente limpia');
    } else {
      console.log('⚠️  Aún quedan datos en la base de datos');
    }
  } catch (error) {
    console.error('❌ Error verificando base de datos:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyClean();



