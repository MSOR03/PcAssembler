"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/services/cloudinary';
import axios from 'axios';

export default function ProductosPage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/api/top-components');

        // Filtrar y transformar productos
        const filteredProducts = response.data
          .filter(product => {
            // Filtrar productos con precios válidos (no 0, no negativos, no exagerados > 10000)
            const price = product.precio || product.averagePrice || 0;
            return price > 0 && price < 10000;
          })
          .slice(0, 6) // Limitar a 6 productos destacados
          .map((product, index) => ({
            id: product.id_componente,
            name: product.nombre,
            description: product.descripcion || `Componente ${product.categoria} de alta calidad`,
            price: Math.round(product.precio || product.averagePrice || 0),
            image: getImageUrl(product.imagenUrl),
            category: getCategoryDisplayName(product.categoria),
            badge: getBadgeForIndex(index),
            originalCategory: product.categoria,
            specs: product.especificaciones || {},
            rating: product.averageRating || null,
            marca: product.marca || 'Sin marca'
          }));

        setFeaturedProducts(filteredProducts);
      } catch (err) {
        console.error('Error al cargar productos destacados:', err);
        setError('Error al cargar productos destacados');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Función para obtener nombre de categoría en español
  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'Motherboard': 'Placas Base',
      'CPU': 'Procesadores',
      'Video Card': 'Tarjetas Gráficas',
      'Memory': 'Memoria RAM',
      'Storage': 'Almacenamiento',
      'Power Supply': 'Fuentes de Poder',
      'Case': 'Gabinetes',
      'Monitor': 'Monitores'
    };
    return categoryMap[category] || category;
  };

  // Función para asignar badges según la posición
  const getBadgeForIndex = (index) => {
    const badges = ['Más Vendido', 'Recomendado', 'Popular', 'Nuevo', 'Premium', 'Destacado'];
    return badges[index] || 'Destacado';
  };

  // Función para obtener color del badge según categoría
  const getBadgeColor = (category) => {
    const colorMap = {
      'Placas Base': 'bg-blue-500',
      'Procesadores': 'bg-green-500',
      'Tarjetas Gráficas': 'bg-purple-500',
      'Memoria RAM': 'bg-yellow-500',
      'Almacenamiento': 'bg-indigo-500',
      'Fuentes de Poder': 'bg-red-500',
      'Gabinetes': 'bg-pink-500',
      'Monitores': 'bg-teal-500'
    };
    return colorMap[category] || 'bg-purple-500';
  };

  // Función para obtener especificaciones destacadas
  const getFeaturedSpecs = (product) => {
    const specs = product.specs || {};
    const category = product.originalCategory;

    switch (category) {
      case 'CPU':
        return [
          { label: 'Núcleos', value: specs['Core Count'] || specs['# of CPU Cores'] || '—' },
          { label: 'Hilos', value: specs['Thread Count'] || specs['# of Threads'] || '—' },
          { label: 'Frecuencia Base', value: specs['Performance Core Clock'] || specs['Base Clock'] || '—' },
          { label: 'Frecuencia Turbo', value: specs['Performance Core Boost Clock'] || specs['Boost Clock'] || '—' },
          { label: 'TDP', value: specs['TDP'] || '—' },
          { label: 'Socket', value: specs['Socket'] || '—' }
        ];
      case 'Video Card':
        return [
          { label: 'Memoria', value: specs['Memory'] || specs['VRAM'] || '—' },
          { label: 'Chipset', value: specs['Chipset'] || '—' },
          { label: 'CUDA/Stream', value: specs['CUDA Cores'] || specs['Stream Processors'] || '—' },
          { label: 'Clock Base', value: specs['Core Clock'] || specs['Base Clock'] || '—' },
          { label: 'Clock Boost', value: specs['Boost Clock'] || '—' },
          { label: 'Interfaz', value: specs['Interface'] || '—' }
        ];
      case 'Memory':
        return [
          { label: 'Capacidad', value: specs['Capacity'] || '—' },
          { label: 'Velocidad', value: specs['Speed'] || specs['Memory Speed'] || '—' },
          { label: 'Tipo', value: specs['Type'] || specs['Memory Type'] || '—' },
          { label: 'Latencia CAS', value: specs['CAS Latency'] || '—' },
          { label: 'Módulos', value: specs['Modules'] || specs['# of Modules'] || '—' }
        ];
      case 'Motherboard':
        return [
          { label: 'Socket', value: specs['Socket / CPU'] || specs['Socket'] || '—' },
          { label: 'Chipset', value: specs['Chipset'] || '—' },
          { label: 'Factor de Forma', value: specs['Form Factor'] || '—' },
          { label: 'Ranuras RAM', value: specs['Memory Slots'] || '—' },
          { label: 'Tipo RAM', value: specs['Memory Type'] || '—' },
          { label: 'Slots PCIe x16', value: specs['PCIe x16 Slots'] || '—' }
        ];
      case 'Storage':
        return [
          { label: 'Capacidad', value: specs['Capacity'] || '—' },
          { label: 'Tipo', value: specs['Type'] || specs['Form Factor'] || '—' },
          { label: 'Interfaz', value: specs['Interface'] || '—' },
          { label: 'Lectura Secuencial', value: specs['Sequential Read'] || '—' },
          { label: 'Escritura Secuencial', value: specs['Sequential Write'] || '—' }
        ];
      case 'Power Supply':
        return [
          { label: 'Potencia', value: specs['Wattage'] || specs['Output Wattage'] || '—' },
          { label: 'Certificación', value: specs['Efficiency Rating'] || specs['Efficiency'] || '—' },
          { label: 'Modular', value: specs['Modular'] || specs['Type'] || '—' },
          { label: 'Factor de Forma', value: specs['Form Factor'] || '—' }
        ];
      case 'Monitor':
        return [
          { label: 'Tamaño', value: specs['Screen Size'] || '—' },
          { label: 'Resolución', value: specs['Resolution'] || '—' },
          { label: 'Tasa de Refresco', value: specs['Refresh Rate'] || '—' },
          { label: 'Tipo de Panel', value: specs['Panel Type'] || '—' },
          { label: 'Tiempo de Respuesta', value: specs['Response Time'] || '—' }
        ];
      case 'Case':
        return [
          { label: 'Tipo', value: specs['Type'] || '—' },
          { label: 'Factor MB', value: specs['Motherboard Form Factor'] || '—' },
          { label: 'GPU Máx', value: specs['Maximum Video Card Length'] || '—' },
          { label: 'Ventiladores', value: specs['Front Panel USB'] || '—' }
        ];
      default:
        return [];
    }
  };

  // Función para renderizar estrellas de rating
  const renderStars = (rating) => {
    if (!rating || rating === 0) return null;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {/* Estrellas llenas */}
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
        {/* Estrella media */}
        {hasHalfStar && (
          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="halfStar">
                <stop offset="50%" stopColor="currentColor"/>
                <stop offset="50%" stopColor="transparent"/>
              </linearGradient>
            </defs>
            <path fill="url(#halfStar)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )}
        {/* Estrellas vacías */}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando productos destacados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">❌ {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Hero Section */}
      <div className="relative py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Productos <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Destacados</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              Descubre nuestra selección de componentes premium para tu próximo proyecto
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {featuredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 dark:text-gray-400 text-lg">
              No hay productos destacados disponibles en este momento
            </div>
          </div>
        ) : (
          <div className="grid gap-8">
            {/* Primera fila - 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProducts.slice(0, 2).map((product) => (
                <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/400x400/1f2937/ffffff?text=No+Image';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 text-white text-sm font-semibold rounded-full shadow-lg ${getBadgeColor(product.category)}`}>
                        {product.badge}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
                        {product.category}
                      </div>
                      {renderStars(product.rating)}
                    </div>

                    <div className="mb-4">
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                        {product.marca}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 leading-tight flex-grow">
                      {product.name}
                    </h3>

                    {/* Especificaciones destacadas */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      {getFeaturedSpecs(product).map((spec, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-3 text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                            {spec.label}
                          </div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {spec.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center mt-auto">
                      <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                        ${product.price}
                      </span>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        USD
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Segunda fila - 1 columna (ancho completo) */}
            {featuredProducts.slice(2, 3).map((product) => (
              <div key={product.id} className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-96 md:h-auto bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-8"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/600x600/1f2937/ffffff?text=No+Image';
                      }}
                    />
                    <div className="absolute top-6 left-6">
                      <span className={`px-4 py-2 text-white text-sm font-semibold rounded-full shadow-lg ${getBadgeColor(product.category)}`}>
                        {product.badge}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
                        ⭐ {product.category}
                      </div>
                      {renderStars(product.rating)}
                    </div>

                    <div className="mb-4">
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                        {product.marca}
                      </span>
                    </div>

                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                      {product.name}
                    </h3>

                    {/* Especificaciones destacadas para la tarjeta grande */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                      {getFeaturedSpecs(product).slice(0, 6).map((spec, index) => (
                        <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl px-3 py-2 text-center border border-blue-100 dark:border-blue-800">
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1 truncate">
                            {spec.label}
                          </div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white truncate" title={spec.value}>
                            {spec.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center">
                      <span className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${product.price}
                      </span>
                      <div className="text-lg text-gray-500 dark:text-gray-400 mt-2">
                        ⭐ Producto Destacado ⭐
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Tercera fila - 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProducts.slice(3).map((product) => (
                <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/400x400/1f2937/ffffff?text=No+Image';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 text-white text-sm font-semibold rounded-full shadow-lg ${getBadgeColor(product.category)}`}>
                        {product.badge}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
                        {product.category}
                      </div>
                      {renderStars(product.rating)}
                    </div>

                    <div className="mb-4">
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                        {product.marca}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 leading-tight flex-grow">
                      {product.name}
                    </h3>

                    {/* Especificaciones destacadas */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {getFeaturedSpecs(product).slice(0, 6).map((spec, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg px-2 py-2 text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 truncate">
                            {spec.label}
                          </div>
                          <div className="text-xs font-semibold text-gray-900 dark:text-white truncate" title={spec.value}>
                            {spec.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center mt-auto">
                      <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                        ${product.price}
                      </span>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        USD
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}