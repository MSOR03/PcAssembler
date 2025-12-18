import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMotherboards() {
  try {
    const motherboard = await prisma.componente.findFirst({
      where: { categoria: 'Motherboard' },
      select: { nombre: true, categoria: true, imagenUrl: true }
    });

    console.log('Ejemplo Motherboard:');
    console.log('Nombre:', motherboard.nombre);
    console.log('Categoría:', motherboard.categoria);
    console.log('URL Imagen:', motherboard.imagenUrl);

    // Verificar que la URL contiene MOTHERBOARD_images
    if (motherboard.imagenUrl.includes('MOTHERBOARD_images')) {
      console.log('✅ URL correcta - contiene MOTHERBOARD_images');
    } else {
      console.log('❌ URL incorrecta - no contiene MOTHERBOARD_images');
    }
  } catch (error) {
    console.error('❌ Error verificando motherboards:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkMotherboards();



