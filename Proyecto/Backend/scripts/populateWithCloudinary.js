import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ⚠️ CONFIGURACIÓN DE CLOUDINARY ⚠️
const CLOUDINARY_CLOUD_NAME = 'dl4icx6ko';
const CLOUDINARY_API_KEY = '256216327322996';
const CLOUDINARY_API_SECRET = 'Oqm2Uk4ZWv1RLraYnypatL1wO3E';
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`;

// INSTRUCCIONES:
// 1. Ve a https://cloudinary.com/console
// 2. Copia tu "Cloud name" del dashboard
// 3. Reemplaza 'TU_CLOUD_NAME_AQUI' con tu cloud name real
// 4. Asegúrate de que tus imágenes estén organizadas en carpetas como:
//    - CPU_images/
//    - GPU_images/
//    - RAM_images/
//    - etc.

// Mapeo de categorías a carpetas de Cloudinary (igual que en tu frontend)
const categoryMap = {
  'Motherboard': 'MOTHERBOARD_images',
  'CPU': 'CPU_images',
  'Video Card': 'GPU_images',
  'Memory': 'RAM_images',
  'Storage': 'STORAGE_images',
  'Power Supply': 'POWER_images',
  'Case': 'CASE_images',
  'Monitor': 'MONITOR_images'
};

// Cargar mapa de URLs de Cloudinary
let cloudinaryUrls = {};
try {
  const urlsData = fs.readFileSync(path.join(__dirname, 'cloudinary-urls.json'), 'utf8');
  cloudinaryUrls = JSON.parse(urlsData);
  console.log(`📄 Cargadas ${Object.keys(cloudinaryUrls).length} URLs de Cloudinary`);
} catch (error) {
  console.error('❌ Error cargando URLs de Cloudinary:', error.message);
  process.exit(1);
}

// Función para obtener URL de Cloudinary desde el mapa
function getCloudinaryUrl(category, imageName) {
  const folder = categoryMap[category] || 'default';
  const cleanImageName = imageName.replace(/\.[^/.]+$/, ''); // Remove extension

  // Buscar la URL en el mapa de URLs subidas
  for (const [key, url] of Object.entries(cloudinaryUrls)) {
    if (key.includes(cleanImageName) && key.includes(folder)) {
      return url;
    }
  }

  console.warn(`⚠️  No se encontró URL para: ${folder}/${cleanImageName}`);
  return `${CLOUDINARY_BASE_URL}default/default.jpg`;
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

// Función para procesar un archivo de datos
async function processDataFile(fileName, category) {
  const filePath = path.join(__dirname, '..', 'data', fileName);
  const jsonData = loadJsonData(filePath);

  console.log(`📊 Procesando ${jsonData.length} componentes ${category}...`);

  for (const item of jsonData) {
    const offers = item.prices?.prices || [];
    let total = offers.reduce((sum, offer) => sum + (offer.price || 0), 0);
    let averagePrice = offers.length > 0 ? total / offers.length : 0;
    let lowestPrice = offers.length > 0 ? Math.min(...offers.map(offer => offer.price || Infinity)) : 0;

    // Generar URL de Cloudinary
    const imagenUrl = item.image
      ? getCloudinaryUrl(item.category, path.basename(item.image))
      : `${CLOUDINARY_BASE_URL}default/default.jpg`;

    try {
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
    } catch (error) {
      console.error(`❌ Error insertando ${item.name}:`, error.message);
    }
  }

  console.log(`✅ ${category} completado`);
}

// Función principal
async function populateDatabase() {
  try {
    console.log('🚀 Iniciando población de base de datos con URLs de Cloudinary...');
    console.log(`📸 Usando Cloudinary: ${CLOUDINARY_BASE_URL}`);

    // Verificar configuración
    if (CLOUDINARY_CLOUD_NAME === 'TU_CLOUD_NAME_AQUI') {
      console.error('❌ ERROR: Debes configurar tu CLOUD_NAME de Cloudinary en el script');
      console.log('📝 Edita la variable CLOUDINARY_CLOUD_NAME en este archivo');
      process.exit(1);
    }

    // Procesar todos los archivos de datos
    const dataFiles = [
      { file: 'CPU_Update.json', category: 'CPU' },
      { file: 'GPU_Update.json', category: 'GPU' },
      { file: 'RAM_Update.json', category: 'RAM' },
      { file: 'MOTHERBOARD_Update.json', category: 'Motherboard' },
      { file: 'POWER_Update.json', category: 'Power Supply' },
      { file: 'CASE_Update.json', category: 'Case' },
      { file: 'STORAGE_Update.json', category: 'Storage' },
      { file: 'MONITOR_Update.json', category: 'Monitor' }
    ];

    for (const { file, category } of dataFiles) {
      await processDataFile(file, category);
    }

    console.log('🎉 ¡Base de datos poblada exitosamente con URLs de Cloudinary!');

  } catch (error) {
    console.error('❌ Error en el proceso de población:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateDatabase();
