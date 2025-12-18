import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ⚠️ CONFIGURACIÓN DE CLOUDINARY - MODIFICA ESTO ⚠️
const CLOUDINARY_CLOUD_NAME = 'TU_CLOUD_NAME_AQUI'; // Reemplaza con tu cloud name real
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`;

// Mapeo de categorías a carpetas
const categoryMap = {
  'Motherboard': 'MONITOR_images',
  'CPU': 'CPU_images',
  'Video Card': 'GPU_images',
  'Memory': 'RAM_images',
  'Storage': 'STORAGE_images',
  'Power Supply': 'POWER_images',
  'Case': 'CASE_images',
  'Monitor': 'MONITOR_images'
};

// Función para generar URL de Cloudinary
function getCloudinaryUrl(category, imageName) {
  const folder = categoryMap[category] || 'default';
  const cleanImageName = imageName.replace(/\.[^/.]+$/, '');
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

function testCloudinaryUrls() {
  console.log('🧪 Probando URLs de Cloudinary...\n');

  // Verificar configuración
  if (CLOUDINARY_CLOUD_NAME === 'TU_CLOUD_NAME_AQUI') {
    console.error('❌ ERROR: Debes configurar tu CLOUD_NAME de Cloudinary en el script');
    console.log('📝 Edita la variable CLOUDINARY_CLOUD_NAME en este archivo\n');
    return;
  }

  console.log(`📸 Cloudinary Base URL: ${CLOUDINARY_BASE_URL}\n`);

  // Probar con algunos ejemplos de cada categoría
  const testData = {
    'CPU': 'CPU_Update.json',
    'Video Card': 'GPU_Update.json',
    'Memory': 'RAM_Update.json'
  };

  for (const [category, fileName] of Object.entries(testData)) {
    const filePath = path.join(__dirname, '..', 'data', fileName);
    const jsonData = loadJsonData(filePath);

    if (jsonData.length > 0) {
      const sampleItem = jsonData[0];
      if (sampleItem.image) {
        const cloudinaryUrl = getCloudinaryUrl(sampleItem.category, path.basename(sampleItem.image));
        console.log(`🔗 ${category}: ${cloudinaryUrl}`);
        console.log(`   Original: ${sampleItem.image}`);
        console.log(`   Componente: ${sampleItem.name}\n`);
      }
    }
  }

  console.log('💡 Para verificar que las URLs funcionan:');
  console.log('1. Copia una URL de arriba');
  console.log('2. Pégala en tu navegador');
  console.log('3. Si la imagen carga, la configuración es correcta');
  console.log('4. Si no carga, verifica que las imágenes estén en Cloudinary con los nombres correctos\n');

  console.log('📝 Si necesitas cambiar el formato de las URLs, edita la función getCloudinaryUrl()');
}

testCloudinaryUrls();



