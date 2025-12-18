import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Cloudinary
const CLOUDINARY_CLOUD_NAME = 'tu-cloud-name-aqui'; // Reemplaza con tu cloud name real
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`;

// Función para generar URL de Cloudinary
function getCloudinaryUrl(category, imageName) {
  const categoryMap = {
    'CPU': 'CPU_images',
    'Video Card': 'GPU_images',
    'Memory': 'RAM_images',
    'Storage': 'STORAGE_images',
    'Power Supply': 'POWER_images',
    'Case': 'CASE_images',
    'Monitor': 'MONITOR_images',
    'Motherboard': 'MONITOR_images'
  };

  const folder = categoryMap[category] || 'default';
  const cleanImageName = imageName.replace(/\.[^/.]+$/, ''); // Remove extension
  return `${CLOUDINARY_BASE_URL}${folder}/${cleanImageName}.jpg`;
}

// Función auxiliar para obtener datos de un archivo JSON
function loadJsonData(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error leyendo ${filePath}:`, error.message);
    return [];
  }
}

async function insertComponents() {
  try {
    // Cargar datos desde el archivo JSON
    const jsonData = loadJsonData(path.join(__dirname, '..', 'data', 'CPU_Update.json'));

    console.log(`📊 Procesando ${jsonData.length} componentes CPU...`);

    for (const item of jsonData) {
      // Extraer las ofertas de precios
      const offers = item.prices?.prices || [];

      // Calcular el precio promedio y el precio mínimo
      let total = offers.reduce((sum, offer) => sum + (offer.price || 0), 0);
      let averagePrice = offers.length > 0 ? total / offers.length : 0;
      let lowestPrice = offers.length > 0 ? Math.min(...offers.map(offer => offer.price || Infinity)) : 0;

      // Generar URL de Cloudinary en lugar de ruta local
      const imagenUrl = item.image
        ? getCloudinaryUrl(item.category, path.basename(item.image))
        : `${CLOUDINARY_BASE_URL}default/default.jpg`;

      await prisma.componente.create({
        data: {
          nombre: item.name,
          categoria: item.category,
          precio: averagePrice,
          marca: item.specifications?.Manufacturer || 'Desconocido',
          especificaciones: item.specifications,
          url: item.url,
          lowestPrice: lowestPrice,
          averageRating: item.ratings?.averageRating || null,
          imagenUrl: imagenUrl,
        },
      });
    }

    console.log('✅ Datos CPU insertados correctamente');
  } catch (error) {
    console.error('❌ Error insertando datos CPU:', error);
  }
}

insertComponents()
  .catch((e) => {
    console.error('❌ Error en el proceso:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



