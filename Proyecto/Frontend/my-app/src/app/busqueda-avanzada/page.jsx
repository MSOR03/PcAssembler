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

  // Filtros
  const [filters, setFilters] = useState({
    categoria: '',
    marca: '',
    precioMin: '',
    precioMax: '',
    search: '',
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
        comp.descripcion?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredComponents(filtered);
  }, [filters, components]);

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
    });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Búsqueda Avanzada
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Encuentra el componente perfecto para tu PC
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Nombre o descripción..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoría
              </label>
              <select
                name="categoria"
                value={filters.categoria}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todas las categorías</option>
                {getUniqueCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Marca
              </label>
              <select
                name="marca"
                value={filters.marca}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todas las marcas</option>
                {getUniqueBrands().map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Precio Mínimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Precio Mín
              </label>
              <input
                type="number"
                name="precioMin"
                value={filters.precioMin}
                onChange={handleFilterChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Precio Máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Precio Máx
              </label>
              <input
                type="number"
                name="precioMax"
                value={filters.precioMax}
                onChange={handleFilterChange}
                placeholder="5000"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Limpiar Filtros
            </button>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredComponents.length} productos encontrados
            </div>
          </div>
        </div>

        {/* Resultados */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : filteredComponents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No se encontraron componentes que coincidan con los filtros.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredComponents.map((component) => (
              <div
                key={component.id_componente}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={getImageUrl(component.imagenUrl)}
                    alt={component.nombre}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.target.src = '/images/default.jpg';
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
                    {component.categoria}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {component.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {component.descripcion}
                  </p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${component.precio}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {component.marca}
                    </span>
                  </div>
                  <button
                    onClick={() => showComponentDetails(component)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Detalles */}
        {showDetails && selectedComponent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedComponent.nombre}
                  </h2>
                  <button
                    onClick={closeDetails}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative h-64 md:h-80">
                    <Image
                      src={getImageUrl(selectedComponent.imagenUrl)}
                      alt={selectedComponent.nombre}
                      fill
                      className="object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/images/default.jpg';
                      }}
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {selectedComponent.categoria}
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Marca: {selectedComponent.marca}
                      </p>
                    </div>

                    <div>
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${selectedComponent.precio}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Descripción
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {selectedComponent.descripcion}
                      </p>
                    </div>

                    {selectedComponent.especificaciones && (
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Especificaciones
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {typeof selectedComponent.especificaciones === 'object' ? (
                            <ul className="space-y-1">
                              {Object.entries(selectedComponent.especificaciones).map(([key, value]) => (
                                <li key={key} className="flex justify-between">
                                  <span className="font-medium">{key}:</span>
                                  <span>{value}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>{selectedComponent.especificaciones}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <button
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Agregar al Carrito
                      </button>
                    </div>
                  </div>
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
