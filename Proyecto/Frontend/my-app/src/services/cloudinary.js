// Función para construir URL de imagen desde el formato actual
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/default.jpg';

  // Si ya es una URL completa (HTTP/HTTPS), retornarla
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Para rutas locales, intentar construir URL del servidor local
  try {
    const parts = imagePath.split('\\');
    const fileName = parts[parts.length - 1];
    const category = parts[parts.length - 2];

    // Mapear categorías a carpetas de imágenes
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

    const folderName = categoryMap[category] || 'default';
    return `/images/${folderName}/${fileName}`;
  } catch (error) {
    console.warn('Error building image URL, using fallback:', error);
    return '/images/default.jpg';
  }
};

// Función para obtener URL optimizada (placeholder para futuras implementaciones con Cloudinary)
export const getOptimizedImageUrl = (publicId, options = {}) => {
  // Por ahora, retornar URL local
  // En el futuro, implementar con Cloudinary SDK en server-side
  return getImageUrl(publicId);
};

// Función para subir imagen (placeholder para futuras implementaciones)
export const uploadImage = async (file, folder = 'pc-components') => {
  // Placeholder - implementar en server-side cuando sea necesario
  throw new Error('Upload functionality not implemented yet');
};
