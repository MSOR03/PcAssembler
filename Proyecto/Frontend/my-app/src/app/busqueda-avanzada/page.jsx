"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { getImageUrl } from '@/services/cloudinary';

const BusquedaAvanzadaPage = () => {
  const { token } = useAuth();
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('nombre'); // 'nombre', 'precio-asc', 'precio-desc', 'rating'

  // Filtros
  const [filters, setFilters] = useState({
    categoria: '',
    marca: '',
    precioMin: '',
    precioMax: '',
    search: '',
    rating: '',
  });

  // Cargar todos los componentes
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/componentes');
        if (!response.ok) throw new Error('Error al cargar componentes');

        const data = await response.json();
        setComponents(data);
        setFilteredComponents(data);
      } catch (error) {
        setError('Error al cargar los componentes');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...components];

    // Filtro por categoría
    if (filters.categoria) {
      filtered = filtered.filter(comp =>
        comp.categoria?.toLowerCase().includes(filters.categoria.toLowerCase())
      );
    }

    // Filtro por marca
    if (filters.marca) {
      filtered = filtered.filter(comp =>
        comp.marca?.toLowerCase().includes(filters.marca.toLowerCase())
      );
    }

    // Filtro por precio mínimo
    if (filters.precioMin) {
      filtered = filtered.filter(comp => comp.precio >= parseFloat(filters.precioMin));
    }

    // Filtro por precio máximo
    if (filters.precioMax) {
      filtered = filtered.filter(comp => comp.precio <= parseFloat(filters.precioMax));
    }

    // Búsqueda por nombre
    if (filters.search) {
      filtered = filtered.filter(comp =>
        comp.nombre?.toLowerCase().includes(filters.search.toLowerCase()) ||
        comp.marca?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtro por rating
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(comp => (comp.rating || 0) >= minRating);
    }

    // Ordenar
    switch (sortBy) {
      case 'precio-asc':
        filtered.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
        break;
      case 'precio-desc':
        filtered.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'nombre':
      default:
        filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
    }

    setFilteredComponents(filtered);
  }, [filters, components, sortBy]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      categoria: '',
      marca: '',
      precioMin: '',
      precioMax: '',
      search: '',
      rating: '',
    });
    setSortBy('nombre');
  };


  const showComponentDetails = (component) => {
    setSelectedComponent(component);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedComponent(null);
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(components.map(comp => comp.categoria).filter(Boolean))];
    return categories;
  };

  const getUniqueBrands = () => {
    const brands = [...new Set(components.map(comp => comp.marca).filter(Boolean))];
    return brands;
  };

  // Función para obtener especificaciones clave por categoría
  const getKeySpecs = (component) => {
    // Parsear especificaciones si vienen como string
    let specs = component.especificaciones;
    if (typeof specs === 'string') {
      try {
        specs = JSON.parse(specs);
      } catch (e) {
        specs = {};
      }
    }
    specs = specs || {};
    
    const categoria = component.categoria?.toLowerCase() || '';
    const nombre = component.nombre?.toLowerCase() || '';
    
    let keySpecs = [];
    
    if (categoria.includes('cpu') || categoria.includes('procesador')) {
      keySpecs = [
        { label: 'Núcleos', value: specs['Core Count'] || specs.cores || specs.nucleos || 'N/A' },
        { label: 'Frecuencia', value: specs['Performance Core Clock'] || specs['Performance Core Boost Clock'] || specs.frecuencia || 'N/A' },
        { label: 'Socket', value: specs.Socket || specs.socket || 'N/A' }
      ];
    } else if (categoria.includes('gpu') || categoria.includes('gráfica') || categoria.includes('video') || categoria.includes('graphic')) {
      keySpecs = [
        { label: 'VRAM', value: specs.Memory || specs['Memory Size'] || specs.vram || 'N/A' },
        { label: 'Boost Clock', value: specs['Boost Clock'] || specs['Core Clock'] || specs.boostClock || 'N/A' },
        { label: 'TDP', value: specs.TDP || specs.tdp || 'N/A' }
      ];
    } else if (categoria.includes('ram') || categoria.includes('memoria')) {
      keySpecs = [
        { label: 'Capacidad', value: specs.capacidad || specs.Capacity || specs.size || 'N/A' },
        { label: 'Tipo', value: specs.tipo || specs.Type || specs.DDR || 'N/A' },
        { label: 'Velocidad', value: specs.velocidad || specs.Speed || specs.frequency || 'N/A' }
      ];
    } else if (categoria.includes('motherboard') || categoria.includes('placa')) {
      keySpecs = [
        { label: 'Socket', value: specs.socket || specs.Socket || 'N/A' },
        { label: 'Chipset', value: specs.chipset || specs.Chipset || 'N/A' },
        { label: 'Formato', value: specs.formato || specs.formFactor || specs['Form Factor'] || 'N/A' }
      ];
    } else if (categoria.includes('storage') || categoria.includes('almacenamiento') || categoria.includes('disco') || nombre.includes('ssd') || nombre.includes('hdd')) {
      keySpecs = [
        { label: 'Capacidad', value: specs.capacidad || specs.Capacity || specs.size || 'N/A' },
        { label: 'Tipo', value: specs.tipo || specs.Type || specs.interface || 'N/A' },
        { label: 'Interfaz', value: specs.interfaz || specs.Interface || specs.connection || 'N/A' }
      ];
    } else if (categoria.includes('power') || categoria.includes('fuente') || categoria.includes('psu')) {
      keySpecs = [
        { label: 'Potencia', value: specs.Wattage || specs.wattage || specs.potencia || 'N/A' },
        { label: 'Certificación', value: specs['Efficiency Rating'] || specs.efficiency || specs.certificacion || 'N/A' },
        { label: 'Modular', value: specs.Modular || specs.modular || specs.Type || 'N/A' }
      ];
    } else if (categoria.includes('case') || categoria.includes('gabinete')) {
      keySpecs = [
        { label: 'Formato', value: specs.formato || specs.formFactor || specs['Form Factor'] || specs.type || 'N/A' },
        { label: 'Color', value: specs.color || specs.Color || 'N/A' },
        { label: 'Ventanas', value: specs.panelLateral || specs['Side Panel'] || specs.window || 'N/A' }
      ];
    } else if (categoria.includes('monitor')) {
      keySpecs = [
        { label: 'Tamaño', value: specs['Screen Size'] || specs.size || specs.tamaño || 'N/A' },
        { label: 'Resolución', value: specs.Resolution || specs.resolution || specs.resolucion || 'N/A' },
        { label: 'Tasa Refresco', value: specs['Refresh Rate'] || specs.refreshRate || specs.Hz || 'N/A' }
      ];
    } else {
      // Por defecto, tomar las primeras 3 especificaciones
      const entries = Object.entries(specs).slice(0, 3);
      keySpecs = entries.map(([key, value]) => ({ label: key, value: value || 'N/A' }));
    }
    
    return keySpecs.slice(0, 3); // Máximo 3 specs
  };

  // Función para obtener badge de rating
  const getRatingBadge = (rating) => {
    if (!rating) return null;
    const stars = Math.round(rating);
    return (
      <div className="flex items-center gap-1">
        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header con gradiente */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Búsqueda Avanzada
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Encuentra el componente perfecto para tu build
          </p>
        </div>

        {/* Panel de Filtros Mejorado */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtros
            </h2>
            <div className="flex gap-4 items-center">
              {/* Selector de Vista */}
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-md' : ''}`}
                  title="Vista de cuadrícula"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-md' : ''}`}
                  title="Vista de lista"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {/* Búsqueda */}
            <div className="xl:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                🔍 Buscar
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Nombre o marca..."
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                📦 Categoría
              </label>
              <select
                name="categoria"
                value={filters.categoria}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
              >
                <option value="">Todas</option>
                {getUniqueCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                🏷️ Marca
              </label>
              <select
                name="marca"
                value={filters.marca}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
              >
                <option value="">Todas</option>
                {getUniqueBrands().map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Precio Mínimo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                💵 Precio Mín
              </label>
              <input
                type="number"
                name="precioMin"
                value={filters.precioMin}
                onChange={handleFilterChange}
                placeholder="$0"
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>

            {/* Precio Máximo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                💰 Precio Máx
              </label>
              <input
                type="number"
                name="precioMax"
                value={filters.precioMax}
                onChange={handleFilterChange}
                placeholder="$10000"
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
          </div>

          {/* Fila de ordenamiento y rating */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                ⭐ Rating Mínimo
              </label>
              <select
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
              >
                <option value="">Todos</option>
                <option value="4">4+ Estrellas</option>
                <option value="3">3+ Estrellas</option>
                <option value="2">2+ Estrellas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                🔄 Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
              >
                <option value="nombre">Nombre (A-Z)</option>
                <option value="precio-asc">Precio (Menor a Mayor)</option>
                <option value="precio-desc">Precio (Mayor a Menor)</option>
                <option value="rating">Rating (Mayor a Menor)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🗑️ Limpiar Filtros
              </button>
            </div>
          </div>

          {/* Contador de resultados con badges de filtros activos */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {filteredComponents.length} productos encontrados
            </span>
            {filters.categoria && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-semibold">
                {filters.categoria}
              </span>
            )}
            {filters.marca && (
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-semibold">
                {filters.marca}
              </span>
            )}
            {(filters.precioMin || filters.precioMax) && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold">
                ${filters.precioMin || '0'} - ${filters.precioMax || '∞'}
              </span>
            )}
            {filters.rating && (
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-semibold">
                ⭐ {filters.rating}+
              </span>
            )}
          </div>
        </div>

        {/* Resultados */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : filteredComponents.length === 0 ? (
          <div className="text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-300 text-xl font-semibold">
              No se encontraron componentes
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'flex flex-col gap-4'}>
            {filteredComponents.map((component) => {
              const keySpecs = getKeySpecs(component);
              
              return viewMode === 'grid' ? (
                // Vista de Cuadrícula
                <div
                  key={component.id_componente}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                >
                  <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={getImageUrl(component.imagenUrl)}
                      alt={component.nombre}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/300x300/1f2937/ffffff?text=No+Image';
                      }}
                    />
                    {component.rating && (
                      <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 rounded-full px-3 py-1 backdrop-blur-sm">
                        {getRatingBadge(component.rating)}
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg">
                        {component.categoria}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
                      {component.nombre}
                    </h3>

                    <div className="mb-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {component.marca}
                      </span>
                    </div>

                    {/* Especificaciones Clave - Ahora Prominentes */}
                    {keySpecs.length > 0 && (
                      <div className="mb-4 p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-blue-100 dark:border-gray-600">
                        <div className="space-y-2">
                          {keySpecs.map((spec, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600 dark:text-gray-300 font-medium">
                                {spec.label}:
                              </span>
                              <span className="text-gray-900 dark:text-white font-semibold">
                                {spec.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        ${Math.round(component.precio)}
                      </span>
                    </div>

                    <button
                      onClick={() => showComponentDetails(component)}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Ver Detalles Completos
                    </button>
                  </div>
                </div>
              ) : (
                // Vista de Lista
                <div
                  key={component.id_componente}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-64 h-48 md:h-auto bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={getImageUrl(component.imagenUrl)}
                        alt={component.nombre}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/300x300/1f2937/ffffff?text=No+Image';
                        }}
                      />
                      {component.rating && (
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 rounded-full px-3 py-1 backdrop-blur-sm">
                          {getRatingBadge(component.rating)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex flex-wrap justify-between items-start mb-3">
                        <div className="flex-1">
                          <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full">
                            {component.categoria}
                          </span>
                          <h3 className="font-bold text-xl text-gray-900 dark:text-white mt-2 mb-1">
                            {component.nombre}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {component.marca}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <span className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            ${Math.round(component.precio)}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {component.marca} • {component.categoria}
                      </p>

                      {/* Especificaciones en lista horizontal */}
                      {keySpecs.length > 0 && (
                        <div className="flex flex-wrap gap-3 mb-4">
                          {keySpecs.map((spec, idx) => (
                            <div
                              key={idx}
                              className="px-4 py-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-blue-100 dark:border-gray-600"
                            >
                              <span className="text-xs text-gray-500 dark:text-gray-400 block">
                                {spec.label}
                              </span>
                              <span className="text-sm font-bold text-gray-900 dark:text-white">
                                {spec.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => showComponentDetails(component)}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                      >
                        Ver Detalles Completos
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal de Detalles Mejorado */}
        {showDetails && selectedComponent && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full inline-block mb-3">
                    {selectedComponent.categoria}
                  </span>
                  <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    {selectedComponent.nombre}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {selectedComponent.marca}
                  </p>
                </div>
                <button
                  onClick={closeDetails}
                  className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                  {/* Imagen */}
                  <div className="space-y-4">
                    <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl">
                      <Image
                        src={getImageUrl(selectedComponent.imagenUrl)}
                        alt={selectedComponent.nombre}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/600x600/1f2937/ffffff?text=No+Image';
                        }}
                      />
                    </div>
                    {selectedComponent.rating && (
                      <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-6 h-6 ${i < Math.round(selectedComponent.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-lg font-bold text-gray-800 dark:text-white">
                          {selectedComponent.rating.toFixed(1)} / 5.0
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Información */}
                  <div className="space-y-6">
                    {/* Precio */}
                    <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-green-100 dark:border-gray-600">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Precio</p>
                      <p className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        ${Math.round(selectedComponent.precio)}
                      </p>
                    </div>

                    {/* Información del Producto */}
                    <div className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Información
                      </h3>
                      <div className="space-y-2 text-gray-700 dark:text-gray-300">
                        <p><span className="font-semibold">Categoría:</span> {selectedComponent.categoria}</p>
                        <p><span className="font-semibold">Marca:</span> {selectedComponent.marca}</p>
                        <p><span className="font-semibold">Nombre:</span> {selectedComponent.nombre}</p>
                      </div>
                    </div>

                    {/* Stock/Disponibilidad */}
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-700 dark:text-green-300 font-semibold">
                        Disponible en stock
                      </span>
                    </div>
                  </div>
                </div>

                {/* Especificaciones Técnicas */}
                {selectedComponent.especificaciones && (
                  <div className="p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-2xl border-2 border-blue-100 dark:border-gray-600">
                    <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      Especificaciones Técnicas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {typeof selectedComponent.especificaciones === 'object' ? (
                        Object.entries(selectedComponent.especificaciones).map(([key, value]) => (
                          <div
                            key={key}
                            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600"
                          >
                            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
                              {key}
                            </div>
                            <div className="text-base font-bold text-gray-900 dark:text-white">
                              {value || 'N/A'}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 p-4 bg-white dark:bg-gray-800 rounded-xl">
                          <p className="text-gray-700 dark:text-gray-300">
                            {selectedComponent.especificaciones}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Botones de Acción */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <button
                    onClick={closeDetails}
                    className="px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-bold text-lg"
                  >
                    Cerrar
                  </button>
                  <button
                    className="px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    🛒 Agregar al Ensamble
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusquedaAvanzadaPage;
