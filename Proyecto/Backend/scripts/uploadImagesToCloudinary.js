import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: 'dl4icx6ko',
  api_key: '256216327322996',
  api_secret: 'Oqm2Uk4ZWv1RLraYnypatL1wO3E'
});

// Función para encontrar todas las imágenes en una carpeta
function findImagesInFolder(folderPath) {
  const images = [];
  const items = fs.readdirSync(folderPath);

  for (const item of items) {
    const fullPath = path.join(folderPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Si es una carpeta, buscar recursivamente
      images.push(...findImagesInFolder(fullPath));
    } else if (stat.isFile()) {
      // Si es un archivo, verificar si es una imagen
      const ext = path.extname(item).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
        images.push(fullPath);
      }
    }
  }

  return images;
}

// Función para subir imagen a Cloudinary
async function uploadImageToCloudinary(localPath, folder) {
  try {
    console.log(`📤 Subiendo: ${path.basename(localPath)}`);
    const result = await cloudinary.uploader.upload(localPath, {
      folder: folder,
      resource_type: 'image',
      public_id: path.basename(localPath, path.extname(localPath)), // Nombre sin extensión
      overwrite: true
    });
    console.log(`✅ Subida exitosa: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error subiendo ${localPath}:`, error.message);
    return null;
  }
}

// Función principal
async function uploadAllImages() {
  try {
    console.log('🚀 Iniciando subida de imágenes a Cloudinary...\n');

    // Buscar todas las carpetas de imágenes
    const imagesFolder = path.join(__dirname, '..', '..', 'Frontend', 'my-app', 'public', 'images');
    console.log(`📁 Buscando imágenes en: ${imagesFolder}`);

    if (!fs.existsSync(imagesFolder)) {
      console.error('❌ No se encontró la carpeta de imágenes');
      return;
    }

    const allImages = findImagesInFolder(imagesFolder);
    console.log(`📊 Encontradas ${allImages.length} imágenes\n`);

    // Mapa para almacenar las URLs de Cloudinary
    const uploadedImages = {};

    for (const imagePath of allImages) {
      // Determinar la carpeta de Cloudinary basada en la ruta local
      const relativePath = path.relative(imagesFolder, imagePath);
      const folderParts = relativePath.split(path.sep);
      const mainFolder = folderParts[0]; // Ej: 'CPU_images', 'GPU_images', etc.

      const cloudinaryUrl = await uploadImageToCloudinary(imagePath, mainFolder);

      if (cloudinaryUrl) {
        // Guardar la URL con la ruta relativa como clave
        const relativeKey = relativePath.replace(/\\/g, '/'); // Convertir backslashes a forward slashes
        uploadedImages[relativeKey] = cloudinaryUrl;
      }
    }

    // Guardar el mapa de URLs en un archivo JSON para usar después
    const outputFile = path.join(__dirname, 'cloudinary-urls.json');
    fs.writeFileSync(outputFile, JSON.stringify(uploadedImages, null, 2));

    console.log(`\n📄 URLs guardadas en: ${outputFile}`);
    console.log(`🎉 ¡Subida completada! ${Object.keys(uploadedImages).length} imágenes subidas a Cloudinary`);

  } catch (error) {
    console.error('❌ Error en el proceso de subida:', error);
  }
}

uploadAllImages();
