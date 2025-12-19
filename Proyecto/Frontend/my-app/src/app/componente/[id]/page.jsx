"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/services/cloudinary';
import axios from 'axios';

export default function ComponenteDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [componente, setComponente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComponente = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/api/componente/${params.id}`);

        if (response.data) {
          setComponente(response.data);
        } else {
          setError('Componente no encontrado');
        }
      } catch (err) {
        console.error('Error al cargar componente:', err);
        setError('Error al cargar el componente');
      } finally {
        setLoading(false);
      }
    };

    fetchComponente();
  }, [params.id]);

  // Función para obtener especificaciones formateadas
  const getFormattedSpecs = (specs) => {
    if (!specs) return [];

    return Object.entries(specs).map(([key, value]) => ({
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      value: Array.isArray(value) ? value.join(', ') : String(value)
    }));
  };

  // Función para renderizar estrellas
  const renderStars = (rating) => {
    if (!rating || rating === 0) return null;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {/* Estrellas llenas */}
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
        {/* Estrella media */}
        {hasHalfStar && (
          <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
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
          <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
        <span className="text-lg font-semibold text-gray-900 dark:text-white ml-2">
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
          <p className="text-gray-600 dark:text-gray-400">Cargando componente...</p>
        </div>
      </div>
    );
  }

  if (error || !componente) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">❌ {error || 'Componente no encontrado'}</div>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mr-4"
          >
            ← Volver
          </button>
          <Link href="/productos">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Ver Productos
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const specs = getFormattedSpecs(componente.especificaciones);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Header con navegación */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <Link href="/productos">
              <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium">
                Ver más productos
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagen y información básica */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                <Image
                  src={getImageUrl(componente.imagenUrl)}
                  alt={componente.nombre}
                  fill
                  className="object-contain p-8"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/600x600/1f2937/ffffff?text=No+Image';
                  }}
                />
              </div>
            </div>

            {/* Información básica */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Información del Producto
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Categoría:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{componente.categoria}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Marca:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{componente.marca}</span>
                </div>
                {componente.averageRating && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                    {renderStars(componente.averageRating)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Detalles y especificaciones */}
          <div className="space-y-6">
            {/* Título y precio */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="mb-4">
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                  {componente.categoria}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {componente.nombre}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                  ${Math.round(componente.precio || componente.averagePrice || 0)}
                </span>
                <span className="text-lg text-gray-500 dark:text-gray-400">USD</span>
              </div>

              {/* Rating si existe */}
              {componente.averageRating && (
                <div className="mb-6">
                  {renderStars(componente.averageRating)}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Basado en reseñas de usuarios
                  </p>
                </div>
              )}

              {/* Información del Producto */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Información
                </h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p><span className="font-semibold">Categoría:</span> {componente.categoria}</p>
                  <p><span className="font-semibold">Marca:</span> {componente.marca}</p>
                  <p><span className="font-semibold">Nombre:</span> {componente.nombre}</p>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold">
                  🛒 Agregar al Carrito
                </button>
                <Link href="/armar-pc">
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold">
                    🔧 Usar en Ensamble
                  </button>
                </Link>
              </div>
            </div>

            {/* Especificaciones técnicas */}
            {specs.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Especificaciones Técnicas
                </h3>
                <div className="grid gap-3">
                  {specs.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {spec.label}:
                      </span>
                      <span className="text-gray-900 dark:text-white font-semibold text-right">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
