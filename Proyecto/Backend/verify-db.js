import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyDatabase() {
  try {
    const count = await prisma.componente.count();
    console.log('📊 Total de componentes en BD:', count);

    if (count > 0) {
      const sample = await prisma.componente.findFirst({
        select: {
          nombre: true,
          imagenUrl: true,
          categoria: true
        }
      });
      console.log('🔍 Ejemplo de componente:');
      console.log('  Nombre:', sample.nombre);
      console.log('  Categoría:', sample.categoria);
      console.log('  URL Imagen:', sample.imagenUrl);
    }

    // Verificar que las URLs son de Cloudinary
    const cloudinaryComponents = await prisma.componente.count({
      where: {
        imagenUrl: {
          contains: 'cloudinary.com'
        }
      }
    });

    console.log('☁️  Componentes con URLs de Cloudinary:', cloudinaryComponents);

  } catch (error) {
    console.error('❌ Error verificando base de datos:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();



