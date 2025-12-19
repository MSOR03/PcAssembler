"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useBoards } from '@/hooks/useBoards';
import { useCompatibleCPUs } from '@/hooks/useCompatibleCPUs';
import { useCompatibleGPUs } from '@/hooks/useCompatibleGPUs';
import { useCompatibleMemory } from '@/hooks/useCompatibleMemory';
import { useCompatiblePSU } from '@/hooks/useCompatiblePSU';
import { useCompatibleDisks } from '@/hooks/useCompatibleDisks';
import { useCompatibleCases } from '@/hooks/useCompatibleCases';
import { useCompatibleMonitors } from '@/hooks/useCompatibleMonitors';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { getImageUrl } from '@/services/cloudinary';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

// Función para obtener información específica por categoría
const getComponentSpecs = (component, category) => {
  const specs = component.especificaciones || {};

  switch (category) {
    case 'CPU':
      return {
        'Núcleos': specs['Core Count'] || specs['# of CPU Cores'] || '—',
        'Hilos': specs['Thread Count'] || specs['# of Threads'] || '—',
        'Frecuencia Base': specs['Performance Core Clock'] || specs['Base Clock'] || specs['Processor Base Frequency'] || '—',
        'Frecuencia Turbo': specs['Performance Core Boost Clock'] || specs['Boost Clock'] || specs['Max Turbo Frequency'] || '—',
        'TDP': specs['TDP'] || '—',
        'Socket': specs['Socket'] || specs['CPU Socket'] || '—'
      };
    case 'Video Card':
      return {
        'Memoria': specs['Memory'] || specs['VRAM'] || specs['Video Memory'] || '—',
        'Chipset': specs['Chipset'] || '—',
        'Frecuencia Base': specs['Core Clock'] || specs['Base Clock'] || '—',
        'Frecuencia Boost': specs['Boost Clock'] || specs['Boost Clock (MHz)'] || '—',
        'CUDA/Stream': specs['CUDA Cores'] || specs['Stream Processors'] || '—'
      };
    case 'Memory':
      return {
        'Capacidad': specs['Capacity'] || specs['Total Capacity'] || '—',
        'Velocidad': specs['Speed'] || specs['Memory Speed'] || '—',
        'Tipo': specs['Type'] || specs['Memory Type'] || '—',
        'Latencia CAS': specs['CAS Latency'] || '—',
        'Módulos': specs['Modules'] || specs['# of Modules'] || '—'
      };
    case 'Motherboard':
      return {
        'Socket': specs['Socket / CPU'] || specs['Socket'] || specs['CPU Socket'] || '—',
        'Chipset': specs['Chipset'] || specs['Platform Chipset'] || '—',
        'Factor de Forma': specs['Form Factor'] || '—',
        'Ranuras RAM': specs['Memory Slots'] || specs['# of Memory Slots'] || '—',
        'Tipo RAM': specs['Memory Type'] || '—'
      };
    case 'Storage':
      return {
        'Capacidad': specs['Capacity'] || specs['Total Capacity'] || '—',
        'Tipo': specs['Type'] || specs['Form Factor'] || '—',
        'Interfaz': specs['Interface'] || '—',
        'Lectura Secuencial': specs['Sequential Read'] || '—',
        'Escritura Secuencial': specs['Sequential Write'] || '—'
      };
    case 'Power Supply':
      return {
        'Potencia': specs['Wattage'] || specs['Output Wattage'] || '—',
        'Certificación': specs['Efficiency Rating'] || specs['Efficiency'] || '—',
        'Modular': specs['Modular'] || specs['Type'] || '—',
        'Factor de Forma': specs['Form Factor'] || '—'
      };
    case 'Case':
      return {
        'Tipo': specs['Type'] || '—',
        'Factor MB': specs['Motherboard Form Factor'] || specs['Supported Motherboard'] || '—',
        'GPU Máxima': specs['Maximum Video Card Length'] || '—',
        'Panel Lateral': specs['Side Panel'] || '—'
      };
    case 'Monitor':
      return {
        'Tamaño': specs['Screen Size'] || specs['Display Size'] || '—',
        'Resolución': specs['Resolution'] || specs['Maximum Resolution'] || '—',
        'Tasa de Refresco': specs['Refresh Rate'] || specs['Maximum Refresh Rate'] || '—',
        'Tipo de Panel': specs['Panel Type'] || '—',
        'Tiempo de Respuesta': specs['Response Time'] || '—'
      };
    default:
      return {};
  }
};

// Componente para mostrar especificaciones de un componente
const ComponentSpecs = ({ component, category }) => {
  const specs = getComponentSpecs(component, category);

  if (Object.keys(specs).length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 text-xs mt-3">
      {Object.entries(specs).slice(0, 4).map(([key, value]) => (
        <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded px-2 py-1">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400 text-xs">{key}:</span>
            <span className={`font-semibold text-xs ${value === '—' ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
              {value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente de tarjeta de componente mejorado
const ComponentCard = ({ component, category, isSelected, onSelect, onViewDetails }) => {
  return (
    <div
      onClick={() => onSelect(component)}
      className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 overflow-hidden ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
      }`}
    >
      {/* Badge de selección */}
      {isSelected && (
        <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full p-2 z-10 shadow-lg animate-pulse">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      )}

      {/* Imagen */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
        <Image
          src={getImageUrl(component.imagenUrl)}
          alt={component.nombre}
          fill
          className="object-contain p-4"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x300/1f2937/ffffff?text=No+Image';
          }}
        />
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Marca y precio */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-full shadow-sm">
            {component.marca}
          </span>
          <div className="text-right">
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              ${Math.round(component.precio)}
            </span>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              USD
            </div>
          </div>
        </div>

        {/* Nombre */}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm leading-tight">
          {component.nombre}
        </h3>

        {/* Especificaciones */}
        <ComponentSpecs component={component} category={category} />

        {/* Descripción */}
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
          {component.descripcion}
        </p>

        {/* Botón de detalles */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(component);
          }}
          className="w-full mt-3 px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          🔍 Ver Detalles
        </button>
      </div>
    </div>
  );
};

// Modal de detalles del componente
const ComponentDetailsModal = ({ component, category, isOpen, onClose }) => {
  if (!isOpen || !component) return null;

  const specs = getComponentSpecs(component, category);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {component.nombre}
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {component.marca}
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${component.precio}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Imagen */}
            <div className="relative h-64 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Image
                src={getImageUrl(component.imagenUrl)}
                alt={component.nombre}
                fill
                className="object-contain p-4"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/400x400/1f2937/ffffff?text=No+Image';
                }}
              />
            </div>

            {/* Detalles */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Descripción
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {component.descripcion}
                </p>
              </div>

              {Object.keys(specs).length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Especificaciones Técnicas
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {component.especificaciones && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Especificaciones Completas
                  </h3>
                  <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded max-h-32 overflow-y-auto">
                    <pre>{JSON.stringify(component.especificaciones, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de filtros
const ComponentFilters = ({ onFilterChange, filters, availableBrands = [] }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 mb-6 border border-blue-200 dark:border-gray-700 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Buscar por nombre */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            🔍 Buscar
          </label>
          <input
            type="text"
            placeholder="Nombre del componente..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm transition-all"
          />
        </div>

        {/* Filtrar por marca */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            🏷️ Marca
          </label>
          <select
            value={filters.brand || ''}
            onChange={(e) => onFilterChange('brand', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm transition-all"
          >
            <option value="">Todas las marcas</option>
            {availableBrands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Precio mínimo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            💰 Precio Mín
          </label>
          <input
            type="number"
            placeholder="0"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white text-sm transition-all"
          />
        </div>

        {/* Precio máximo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            💰 Precio Máx
          </label>
          <input
            type="number"
            placeholder="5000"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white text-sm transition-all"
          />
        </div>
      </div>

      {/* Botón de limpiar filtros */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => onFilterChange('clear')}
          className="px-6 py-2 text-sm bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          🗑️ Limpiar Filtros
        </button>
      </div>
    </div>
  );
};

const ArmarPcPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const editId = searchParams.get('edit'); // ID del ensamble a editar

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEnsambleId, setEditingEnsambleId] = useState(null);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);

  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedCPU, setSelectedCPU] = useState(null);
  const [selectedGPU, setSelectedGPU] = useState(null);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [selectedPSU, setSelectedPSU] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedMonitor, setSelectedMonitor] = useState(null);
  const [assembleName, setAssembleName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Estado para filtros
  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    minPrice: '',
    maxPrice: ''
  });

  // Estado para modal de detalles
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Estado para manejo de reintentos en ensamblaje automático
  const [retryAttempts, setRetryAttempts] = useState({
    motherboard: 0,
    cpu: 0,
    gpu: 0,
    memory: 0,
    storage: 0,
    psu: 0,
    case: 0,
    monitor: 0
  });

  const [formData, setFormData] = useState({
    procesador: '',
    motherboard: '',
    ram: '',
    almacenamiento: '',
    gpu: '',
    fuente: '',
    gabinete: '',
    monitor: '',
    perifericos: '',
    presupuesto: '',
  });

  const [currentStep, setCurrentStep] = useState(1);

  const { token } = useAuth();

  const { boards, loading: loadingBoards, error: boardsError } = useBoards();

  // Solo llamar a useCompatibleCPUs cuando estemos en el paso 2
  const { cpus, loading: loadingCPUs, error: cpusError } = useCompatibleCPUs(
    currentStep === 2 ? formData.motherboard : null
  );

  // Solo llamar a useCompatibleGPUs cuando estemos en el paso 3
  const { gpus, loading: loadingGPUs, error: gpusError } = useCompatibleGPUs(
    currentStep === 3 ? formData.motherboard : null,
    currentStep === 3 ? formData.procesador : null
  );

  // Solo llamar a useCompatibleMemory cuando estemos en el paso 4
  const { memory, loading: loadingMemory, error: memoryError } = useCompatibleMemory(
    currentStep === 4 ? formData.motherboard : null,
    currentStep === 4 ? formData.procesador : null,
    currentStep === 4 ? formData.gpu : null
  );

  // Solo llamar a useCompatibleDisks cuando estemos en el paso 5
  const { disks, loading: loadingDisks, error: disksError } = useCompatibleDisks(
    currentStep === 5 ? formData.motherboard : null,
    currentStep === 5 ? formData.procesador : null,
    currentStep === 5 ? formData.gpu : null,
    currentStep === 5 ? formData.ram : null
  );

  // Solo llamar a useCompatiblePSU cuando estemos en el paso 6
  const { psus, loading: loadingPSUs, error: psusError } = useCompatiblePSU(
    currentStep === 6 ? formData.motherboard : null,
    currentStep === 6 ? formData.procesador : null,
    currentStep === 6 ? formData.gpu : null,
    currentStep === 6 ? formData.ram : null
  );

  // Solo llamar a useCompatibleCases cuando estemos en el paso 7
  const { cases, loading: loadingCases, error: casesError } = useCompatibleCases(
    currentStep === 7 ? formData.motherboard : null,
    currentStep === 7 ? formData.gpu : null,
    currentStep === 7 ? formData.fuente : null
  );

  // Solo llamar a useCompatibleMonitors cuando estemos en el paso 8
  const { monitors, loading: loadingMonitors, error: monitorsError } = useCompatibleMonitors(
    currentStep === 8 ? formData.gpu : null
  );

  const steps = [
    { number: 1, title: "Tarjeta Madre" },
    { number: 2, title: "Procesador" },
    { number: 3, title: "Tarjeta Grafica" },
    { number: 4, title: "Memoria RAM" },
    { number: 5, title: "Disco Duro" },
    { number: 6, title: "Fuente" },
    { number: 7, title: "Gabinete" },
    { number: 8, title: "Monitor" },
    { number: 9, title: "Resumen" }
  ];

  const handleBoardSelect = (board) => {
    setSelectedBoard(board);
    setFormData(prev => ({
      ...prev,
      motherboard: board.id_componente
    }));
    // Auto-avance al siguiente paso
    setTimeout(() => setCurrentStep(2), 500);
  };

  const handleCPUSelect = (cpu) => {
    setSelectedCPU(cpu);
    setFormData(prev => ({
      ...prev,
      procesador: cpu.id_componente
    }));
    // Auto-avance al siguiente paso
    setTimeout(() => setCurrentStep(3), 500);
  };

  const handleGPUSelect = (gpu) => {
    setSelectedGPU(gpu);
    setFormData(prev => ({
      ...prev,
      gpu: gpu.id_componente
    }));
    // Auto-avance al siguiente paso
    setTimeout(() => setCurrentStep(4), 500);
  };

  const handleMemorySelect = (memoryItem) => {
    setSelectedMemory(memoryItem);
    setFormData(prev => ({
      ...prev,
      ram: memoryItem.id_componente
    }));
    // Auto-avance al siguiente paso
    setTimeout(() => setCurrentStep(5), 500);
  };

  const handlePSUSelect = (psu) => {
    setSelectedPSU(psu);
    setFormData(prev => ({
      ...prev,
      fuente: psu.id_componente
    }));
    // Auto-avance al siguiente paso
    setTimeout(() => setCurrentStep(7), 500);
  };

  const handleStorageSelect = (storage) => {
    setSelectedStorage(storage);
    setFormData(prev => ({
      ...prev,
      almacenamiento: storage.id_componente
    }));
    // Auto-avance al siguiente paso
    setTimeout(() => setCurrentStep(6), 500);
  };

  const handleCaseSelect = (case_) => {
    setSelectedCase(case_);
    setFormData(prev => ({
      ...prev,
      gabinete: case_.id_componente
    }));
    // Auto-avance al siguiente paso
    setTimeout(() => setCurrentStep(8), 500);
  };

  const handleMonitorSelect = (monitor) => {
    setSelectedMonitor(monitor);
    setFormData(prev => ({
      ...prev,
      monitor: monitor.id_componente
    }));
    // Auto-avance al siguiente paso
    setTimeout(() => setCurrentStep(9), 500);
  };

  const handleNext = () => {
    if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  // Función para manejar cambios en filtros
  const handleFilterChange = (key, value) => {
    if (key === 'clear') {
      setFilters({
        search: '',
        brand: '',
        minPrice: '',
        maxPrice: ''
      });
    } else {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  // ==================== AUTOMATIC ASSEMBLY LOGIC ====================
  
  // Helper function to select component based on type with retry support
  const selectComponentByType = (components, assemblyType, skipIndex = 0) => {
    if (!components || components.length === 0) return null;

    // Filter out invalid prices (0, null, undefined, negative)
    const validComponents = components.filter(comp => 
      comp.precio && 
      typeof comp.precio === 'number' && 
      comp.precio > 0
    );

    if (validComponents.length === 0) return null;

    // Calculate statistics to detect outliers
    const prices = validComponents.map(c => c.precio);
    const sortedPrices = [...prices].sort((a, b) => a - b);
    
    // Calculate IQR (Interquartile Range) for outlier detection
    const q1Index = Math.floor(sortedPrices.length * 0.25);
    const q3Index = Math.floor(sortedPrices.length * 0.75);
    const q1 = sortedPrices[q1Index];
    const q3 = sortedPrices[q3Index];
    const iqr = q3 - q1;
    
    // Define outlier boundaries (1.5 * IQR is standard)
    const lowerBound = q1 - (1.5 * iqr);
    const upperBound = q3 + (1.5 * iqr);
    
    // Filter out extreme outliers
    const cleanComponents = validComponents.filter(comp => 
      comp.precio >= lowerBound && comp.precio <= upperBound
    );

    // If all components are filtered out, use valid components without outlier filtering
    const finalComponents = cleanComponents.length > 0 ? cleanComponents : validComponents;

    // Sort components by price (descending) to have consistent ordering
    const sortedComponents = [...finalComponents].sort((a, b) => b.precio - a.precio);

    // Check if skipIndex is beyond array length
    if (skipIndex >= sortedComponents.length) return null;

    let selectedIndex = skipIndex;

    switch (assemblyType) {
      case 'gaming':
        // Gaming: Select highest performance (highest price typically)
        selectedIndex = 0 + skipIndex;
        break;
      
      case 'workstation':
        // Workstation: Select second-best or mid-high range
        selectedIndex = Math.min(1 + skipIndex, sortedComponents.length - 1);
        break;
      
      case 'streaming':
        // Streaming: Select mid-range components
        const baseStreamingIndex = Math.min(1, Math.floor(sortedComponents.length / 4));
        selectedIndex = Math.min(baseStreamingIndex + skipIndex, sortedComponents.length - 1);
        break;
      
      case 'basic':
        // Basic: Select most economical (lowest price) - work backwards with retry
        selectedIndex = Math.max(0, sortedComponents.length - 1 - skipIndex);
        break;
      
      default:
        return null;
    }

    // Ensure index is within bounds
    if (selectedIndex >= sortedComponents.length) return null;

    return sortedComponents[selectedIndex];
  };

  // Effect to reset states when type changes
  useEffect(() => {
    if (type && ['gaming', 'workstation', 'streaming', 'basic'].includes(type)) {
      // Reset all selections when switching assembly type
      setCurrentStep(1);
      setSelectedBoard(null);
      setSelectedCPU(null);
      setSelectedGPU(null);
      setSelectedMemory(null);
      setSelectedPSU(null);
      setSelectedStorage(null);
      setSelectedCase(null);
      setSelectedMonitor(null);
      setRetryAttempts({
        motherboard: 0,
        cpu: 0,
        gpu: 0,
        memory: 0,
        storage: 0,
        psu: 0,
        case: 0,
        monitor: 0
      });
      setFormData({
        procesador: '',
        motherboard: '',
        ram: '',
        almacenamiento: '',
        gpu: '',
        fuente: '',
        gabinete: '',
        monitor: '',
        perifericos: '',
        presupuesto: '',
      });
    }
  }, [type]);

  // Effect to load ensamble data when in edit mode
  useEffect(() => {
    const loadEnsambleForEdit = async () => {
      if (!editId || !token) return;

      setIsLoadingEdit(true);
      setIsEditMode(true);
      setEditingEnsambleId(editId);

      try {
        // Obtener todos los ensambles del usuario
        const response = await axios.get('http://localhost:3001/api/obtener-ensambles-usuario', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Buscar el ensamble específico
        const ensamble = response.data.ensambles.find(e => e.id_ensamble === parseInt(editId));
        
        if (!ensamble) {
          alert('No se encontró el ensamble a editar');
          router.push('/perfil');
          return;
        }

        // Cargar el nombre
        setAssembleName(ensamble.nombre_ensamble);

        // Cargar los componentes
        const componentes = ensamble.componentes;
        
        if (componentes['Motherboard']) {
          setSelectedBoard(componentes['Motherboard']);
          setFormData(prev => ({ ...prev, motherboard: componentes['Motherboard'].id_componente }));
        }
        
        if (componentes['CPU']) {
          setSelectedCPU(componentes['CPU']);
          setFormData(prev => ({ ...prev, procesador: componentes['CPU'].id_componente }));
        }
        
        if (componentes['Video Card']) {
          setSelectedGPU(componentes['Video Card']);
          setFormData(prev => ({ ...prev, gpu: componentes['Video Card'].id_componente }));
        }
        
        if (componentes['Memory']) {
          setSelectedMemory(componentes['Memory']);
          setFormData(prev => ({ ...prev, ram: componentes['Memory'].id_componente }));
        }
        
        if (componentes['Storage']) {
          setSelectedStorage(componentes['Storage']);
          setFormData(prev => ({ ...prev, almacenamiento: componentes['Storage'].id_componente }));
        }
        
        if (componentes['Power Supply']) {
          setSelectedPSU(componentes['Power Supply']);
          setFormData(prev => ({ ...prev, fuente: componentes['Power Supply'].id_componente }));
        }
        
        if (componentes['Case']) {
          setSelectedCase(componentes['Case']);
          setFormData(prev => ({ ...prev, gabinete: componentes['Case'].id_componente }));
        }
        
        if (componentes['Monitor']) {
          setSelectedMonitor(componentes['Monitor']);
          setFormData(prev => ({ ...prev, monitor: componentes['Monitor'].id_componente }));
        }

        // Ir al paso final para ver el resumen
        setCurrentStep(9);

      } catch (error) {
        console.error('Error al cargar ensamble para editar:', error);
        alert('Error al cargar la configuración');
        router.push('/perfil');
      } finally {
        setIsLoadingEdit(false);
      }
    };

    loadEnsambleForEdit();
  }, [editId, token, router]);

  // Step 1: Auto-select Motherboard with retry
  useEffect(() => {
    if (isEditMode) return; // No auto-seleccionar en modo edición
    if (!type || !['gaming', 'workstation', 'streaming', 'basic'].includes(type)) return;
    if (!boards || boards.length === 0) return;
    if (selectedBoard) return; // Already selected

    const selected = selectComponentByType(boards, type, retryAttempts.motherboard);
    if (selected) {
      setSelectedBoard(selected);
      setFormData(prev => ({
        ...prev,
        motherboard: selected.id_componente
      }));
      // Move to next step after a short delay
      setTimeout(() => setCurrentStep(2), 400);
    } else {
      console.warn('No motherboard available for selection');
    }
  }, [type, boards, selectedBoard, retryAttempts.motherboard]);

  // Step 2: Auto-select CPU with retry and backtrack
  useEffect(() => {
    if (isEditMode) return; // No auto-seleccionar en modo edición
    if (!type || !['gaming', 'workstation', 'streaming', 'basic'].includes(type)) return;
    if (!selectedBoard || !formData.motherboard) return;
    if (selectedCPU) return; // Already selected
    if (currentStep !== 2) return;

    // Wait for CPUs to load
    if (loadingCPUs) return;

    // Check if CPUs are available
    if (!cpus || cpus.length === 0) {
      // No compatible CPUs - try next motherboard (max 5 attempts)
      if (retryAttempts.motherboard < 5) {
        console.warn(`No compatible CPUs found, trying next motherboard (attempt ${retryAttempts.motherboard + 1})...`);
        setSelectedBoard(null);
        setFormData(prev => ({ ...prev, motherboard: '' }));
        setRetryAttempts(prev => ({ ...prev, motherboard: prev.motherboard + 1, cpu: 0 }));
        setTimeout(() => setCurrentStep(1), 200);
      } else {
        console.error('Could not find compatible configuration after multiple attempts');
      }
      return;
    }

    const selected = selectComponentByType(cpus, type, retryAttempts.cpu);
    if (selected) {
      setSelectedCPU(selected);
      setFormData(prev => ({
        ...prev,
        procesador: selected.id_componente
      }));
      setTimeout(() => setCurrentStep(3), 300);
    } else {
      // Tried all CPUs, backtrack to motherboard (max 5 attempts)
      if (retryAttempts.motherboard < 5) {
        console.warn(`Exhausted CPU options, trying next motherboard (attempt ${retryAttempts.motherboard + 1})...`);
        setSelectedBoard(null);
        setFormData(prev => ({ ...prev, motherboard: '' }));
        setRetryAttempts(prev => ({ ...prev, motherboard: prev.motherboard + 1, cpu: 0 }));
        setTimeout(() => setCurrentStep(1), 200);
      } else {
        console.error('Could not find compatible configuration after multiple attempts');
      }
    }
  }, [type, selectedBoard, formData.motherboard, cpus, selectedCPU, currentStep, loadingCPUs, retryAttempts.cpu, retryAttempts.motherboard]);

  // Step 3: Auto-select GPU with retry and backtrack
  useEffect(() => {
    if (isEditMode) return; // No auto-seleccionar en modo edición
    if (!type || !['gaming', 'workstation', 'streaming', 'basic'].includes(type)) return;
    if (!selectedCPU || !formData.procesador) return;
    if (selectedGPU) return;
    if (currentStep !== 3) return;

    if (loadingGPUs) return;

    if (!gpus || gpus.length === 0) {
      if (retryAttempts.cpu < 3) {
        console.warn(`No compatible GPUs found, trying next CPU (attempt ${retryAttempts.cpu + 1})...`);
        setSelectedCPU(null);
        setFormData(prev => ({ ...prev, procesador: '' }));
        setRetryAttempts(prev => ({ ...prev, cpu: prev.cpu + 1, gpu: 0 }));
        setTimeout(() => setCurrentStep(2), 200);
      }
      return;
    }

    const selected = selectComponentByType(gpus, type, retryAttempts.gpu);
    if (selected) {
      setSelectedGPU(selected);
      setFormData(prev => ({
        ...prev,
        gpu: selected.id_componente
      }));
      setTimeout(() => setCurrentStep(4), 300);
    } else if (retryAttempts.cpu < 3) {
      console.warn(`Exhausted GPU options, trying next CPU (attempt ${retryAttempts.cpu + 1})...`);
      setSelectedCPU(null);
      setFormData(prev => ({ ...prev, procesador: '' }));
      setRetryAttempts(prev => ({ ...prev, cpu: prev.cpu + 1, gpu: 0 }));
      setTimeout(() => setCurrentStep(2), 200);
    }
  }, [type, selectedCPU, formData.procesador, gpus, selectedGPU, currentStep, loadingGPUs, retryAttempts.gpu, retryAttempts.cpu]);

  // Step 4: Auto-select Memory with retry and backtrack
  useEffect(() => {
    if (isEditMode) return; // No auto-seleccionar en modo edición
    if (!type || !['gaming', 'workstation', 'streaming', 'basic'].includes(type)) return;
    if (!selectedGPU || !formData.gpu) return;
    if (selectedMemory) return;
    if (currentStep !== 4) return;

    if (loadingMemory) return;

    if (!memory || memory.length === 0) {
      if (retryAttempts.gpu < 3) {
        console.warn(`No compatible Memory found, trying next GPU (attempt ${retryAttempts.gpu + 1})...`);
        setSelectedGPU(null);
        setFormData(prev => ({ ...prev, gpu: '' }));
        setRetryAttempts(prev => ({ ...prev, gpu: prev.gpu + 1, memory: 0 }));
        setTimeout(() => setCurrentStep(3), 200);
      }
      return;
    }

    const selected = selectComponentByType(memory, type, retryAttempts.memory);
    if (selected) {
      setSelectedMemory(selected);
      setFormData(prev => ({
        ...prev,
        ram: selected.id_componente
      }));
      setTimeout(() => setCurrentStep(5), 300);
    } else if (retryAttempts.gpu < 3) {
      console.warn(`Exhausted Memory options, trying next GPU (attempt ${retryAttempts.gpu + 1})...`);
      setSelectedGPU(null);
      setFormData(prev => ({ ...prev, gpu: '' }));
      setRetryAttempts(prev => ({ ...prev, gpu: prev.gpu + 1, memory: 0 }));
      setTimeout(() => setCurrentStep(3), 200);
    }
  }, [type, selectedGPU, formData.gpu, memory, selectedMemory, currentStep, loadingMemory, retryAttempts.memory, retryAttempts.gpu]);

  // Step 5: Auto-select Storage (simplified - usually high compatibility)
  useEffect(() => {
    if (isEditMode) return; // No auto-seleccionar en modo edición
    if (!type || !['gaming', 'workstation', 'streaming', 'basic'].includes(type)) return;
    if (!selectedMemory || !formData.ram) return;
    if (selectedStorage) return;
    if (currentStep !== 5) return;

    if (loadingDisks) return;

    if (!disks || disks.length === 0) {
      console.warn('No compatible Storage found');
      return;
    }

    const selected = selectComponentByType(disks, type, retryAttempts.storage);
    if (selected) {
      setSelectedStorage(selected);
      setFormData(prev => ({
        ...prev,
        almacenamiento: selected.id_componente
      }));
      setTimeout(() => setCurrentStep(6), 300);
    }
  }, [type, selectedMemory, formData.ram, disks, selectedStorage, currentStep, loadingDisks, retryAttempts.storage]);

  // Step 6: Auto-select PSU (simplified - usually high compatibility)
  useEffect(() => {
    if (isEditMode) return; // No auto-seleccionar en modo edición
    if (!type || !['gaming', 'workstation', 'streaming', 'basic'].includes(type)) return;
    if (!selectedStorage || !formData.almacenamiento) return;
    if (selectedPSU) return;
    if (currentStep !== 6) return;

    if (loadingPSUs) return;

    if (!psus || psus.length === 0) {
      console.warn('No compatible PSU found');
      return;
    }

    const selected = selectComponentByType(psus, type, retryAttempts.psu);
    if (selected) {
      setSelectedPSU(selected);
      setFormData(prev => ({
        ...prev,
        fuente: selected.id_componente
      }));
      setTimeout(() => setCurrentStep(7), 300);
    }
  }, [type, selectedStorage, formData.almacenamiento, psus, selectedPSU, currentStep, loadingPSUs, retryAttempts.psu]);

  // Step 7: Auto-select Case (simplified - usually high compatibility)
  useEffect(() => {
    if (isEditMode) return; // No auto-seleccionar en modo edición
    if (!type || !['gaming', 'workstation', 'streaming', 'basic'].includes(type)) return;
    if (!selectedPSU || !formData.fuente) return;
    if (selectedCase) return;
    if (currentStep !== 7) return;

    if (loadingCases) return;

    if (!cases || cases.length === 0) {
      console.warn('No compatible Case found');
      return;
    }

    const selected = selectComponentByType(cases, type, retryAttempts.case);
    if (selected) {
      setSelectedCase(selected);
      setFormData(prev => ({
        ...prev,
        gabinete: selected.id_componente
      }));
      setTimeout(() => setCurrentStep(8), 300);
    }
  }, [type, selectedPSU, formData.fuente, cases, selectedCase, currentStep, loadingCases, retryAttempts.case]);

  // Step 8: Auto-select Monitor (simplified - usually high compatibility)
  useEffect(() => {
    if (isEditMode) return; // No auto-seleccionar en modo edición
    if (!type || !['gaming', 'workstation', 'streaming', 'basic'].includes(type)) return;
    if (!selectedCase || !formData.gabinete) return;
    if (selectedMonitor) return;
    if (currentStep !== 8) return;

    if (loadingMonitors) return;

    if (!monitors || monitors.length === 0) {
      console.warn('No compatible Monitor found');
      return;
    }

    const selected = selectComponentByType(monitors, type, retryAttempts.monitor);
    if (selected) {
      setSelectedMonitor(selected);
      setFormData(prev => ({
        ...prev,
        monitor: selected.id_componente
      }));
      setTimeout(() => setCurrentStep(9), 300);
    }
  }, [type, selectedCase, formData.gabinete, monitors, selectedMonitor, currentStep, loadingMonitors, retryAttempts.monitor]);

  // ==================== END AUTOMATIC ASSEMBLY LOGIC ====================

  // Función para filtrar componentes
  const filterComponents = (components) => {
    return components.filter(component => {
      // Filtro por búsqueda
      if (filters.search && !component.nombre.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Filtro por marca
      if (filters.brand && !component.marca.toLowerCase().includes(filters.brand.toLowerCase())) {
        return false;
      }

      // Filtro por precio mínimo
      if (filters.minPrice && component.precio < parseFloat(filters.minPrice)) {
        return false;
      }

      // Filtro por precio máximo
      if (filters.maxPrice && component.precio > parseFloat(filters.maxPrice)) {
        return false;
      }

      return true;
    });
  };

  // Función para abrir modal de detalles
  const handleViewDetails = (component) => {
    setSelectedComponent(component);
    setShowDetailsModal(true);
  };

  // Función para cerrar modal
  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedComponent(null);
  };

  // Función para guardar el ensamble
  const handleSaveAssemble = async () => {
    if (!token) {
      setSaveMessage('Debes iniciar sesión para guardar tu configuración');
      return;
    }

    if (!assembleName.trim()) {
      setSaveMessage('Por favor ingresa un nombre para tu configuración');
      return;
    }

    // Verificar que todos los componentes estén seleccionados
    const requiredComponents = [
      selectedBoard?.id_componente,
      selectedCPU?.id_componente,
      selectedGPU?.id_componente,
      selectedMemory?.id_componente,
      selectedStorage?.id_componente,
      selectedPSU?.id_componente,
      selectedCase?.id_componente,
      selectedMonitor?.id_componente
    ];

    if (requiredComponents.some(id => !id)) {
      setSaveMessage('Debes completar todos los componentes antes de guardar');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      if (isEditMode && editingEnsambleId) {
        // Actualizar ensamble existente
        const response = await axios.put(
          `http://localhost:3001/api/modificar-ensamble/${editingEnsambleId}`,
          {
            nombre: assembleName,
            componentes: requiredComponents
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setSaveMessage('¡Configuración actualizada exitosamente!');
        setTimeout(() => {
          router.push('/perfil');
        }, 1500);
      } else {
        // Crear nuevo ensamble
        const response = await axios.post('http://localhost:3001/api/registrar-ensamble', {
          nombre: assembleName,
          componentes: requiredComponents
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setSaveMessage('¡Configuración guardada exitosamente!');
        setAssembleName('');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error al guardar el ensamble:', error);
      setSaveMessage(error.response?.data?.error || 'Error al guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  // Función auxiliar para obtener la categoría según el paso
  const getStepCategory = (step) => {
    const categories = {
      1: 'Motherboard',
      2: 'CPU',
      3: 'Video Card',
      4: 'Memory',
      5: 'Storage',
      6: 'Power Supply',
      7: 'Case',
      8: 'Monitor'
    };
    return categories[step] || '';
  };

  // Función para obtener marcas disponibles según el paso actual
  const getAvailableBrands = (components) => {
    if (!components || components.length === 0) return [];
    const brands = [...new Set(components.map(comp => comp.marca).filter(Boolean))];
    return brands.sort();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      {isLoadingEdit ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando configuración...</p>
          </div>
        </div>
      ) : (
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isEditMode ? 'Editar Configuración' : 'Arma tu PC'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditMode ? 'Modifica los componentes de tu configuración' : 'Sigue los pasos para configurar tu PC ideal'}
          </p>

          {/* Precio Total en Tiempo Real */}
          <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg border border-gray-200 dark:border-gray-700 mt-6">
            <span className="text-gray-600 dark:text-gray-400 mr-3">Total actual:</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ${Math.round(
                (selectedBoard?.precio || 0) +
                (selectedCPU?.precio || 0) +
                (selectedGPU?.precio || 0) +
                (selectedMemory?.precio || 0) +
                (selectedStorage?.precio || 0) +
                (selectedPSU?.precio || 0) +
                (selectedCase?.precio || 0) +
                (selectedMonitor?.precio || 0)
              )}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            {steps.map((step) => (
              <div key={step.number} className="relative w-16 h-16 flex flex-col items-center">
                <div className={`w-10 min-h-10 rounded-full flex items-center justify-center border-2
                  ${currentStep >= step.number
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-300 bg-white text-gray-500 dark:bg-gray-800 dark:border-gray-600'}`}>
                  {step.number}
                </div>
                <div className="text-xs mt-2 text-center font-medium text-gray-600 dark:text-gray-400">
                  {step.title}
                </div>
                {step.number !== 9 && (
                  <div className={`absolute top-5 left-[100%] h-[2px]
                    ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
          {/* Mensaje de estado */}
          {((type && ['gaming', 'workstation', 'streaming', 'basic'].includes(type)) || currentStep === 9) && (
            <div className={`mb-6 p-4 rounded-lg text-center ${
              currentStep === 9
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
            }`}>
              <p className="text-lg font-medium">
                {currentStep === 9
                  ? '¡Tu PC se ha armado correctamente!'
                  : 'Se está armando tu PC, espera un momento...'}
              </p>
            </div>
          )}

          <div className="flex justify-between my-8">
              <button
                type="button"
                onClick={handlePrevious}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200
                  ${currentStep === 1
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl border-0'}`}
                disabled={currentStep === 1}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>

              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Paso {currentStep} de 9
                </div>
                <div className="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 transition-all duration-500 rounded-full"
                    style={{ width: `${(currentStep / 9) * 100}%` }}
                  ></div>
                </div>
              </div>

              <button
                type={currentStep === 9 ? 'submit' : 'button'}
                onClick={currentStep === 9 ? handleSubmit : handleNext}
                disabled={
                  (currentStep === 1 && !selectedBoard) ||
                  (currentStep === 2 && (!selectedBoard || !selectedCPU)) ||
                  (currentStep === 3 && (!selectedBoard || !selectedCPU || !selectedGPU)) ||
                  (currentStep === 4 && (!selectedBoard || !selectedCPU || !selectedGPU || !selectedMemory)) ||
                  (currentStep === 5 && (!selectedBoard || !selectedCPU || !selectedGPU || !selectedMemory || !selectedStorage)) ||
                  (currentStep === 6 && (!selectedBoard || !selectedCPU || !selectedGPU || !selectedMemory || !selectedStorage || !selectedPSU)) ||
                  (currentStep === 7 && (!selectedBoard || !selectedCPU || !selectedGPU || !selectedMemory || !selectedStorage || !selectedPSU || !selectedCase)) ||
                  (currentStep === 8 && (!selectedBoard || !selectedCPU || !selectedGPU || !selectedMemory || !selectedStorage || !selectedPSU || !selectedCase || !selectedMonitor)) ||
                  currentStep === 9
                }
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200
                  ${((currentStep === 1 && !selectedBoard) ||
                    (currentStep === 2 && !selectedCPU) ||
                    (currentStep === 3 && !selectedGPU) ||
                    (currentStep === 4 && !selectedMemory) ||
                    (currentStep === 5 && !selectedStorage) ||
                    (currentStep === 6 && !selectedPSU) ||
                    (currentStep === 7 && !selectedCase) ||
                    (currentStep === 8 && !selectedMonitor))
                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 hover:scale-105 shadow-lg hover:shadow-xl border-0'}`}
              >
                {currentStep === 9 ? 'Finalizar' : 'Siguiente'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          <div className="space-y-6">
            {/* Step content */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Selecciona tu Placa Base
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Elige la placa base compatible con tu configuración
                  </p>
                </div>

                <ComponentFilters
                  onFilterChange={handleFilterChange}
                  filters={filters}
                  availableBrands={getAvailableBrands(
                    currentStep === 1 ? boards :
                    currentStep === 2 ? cpus :
                    currentStep === 3 ? gpus :
                    currentStep === 4 ? memory :
                    currentStep === 5 ? disks :
                    currentStep === 6 ? psus :
                    currentStep === 7 ? cases :
                    currentStep === 8 ? monitors : []
                  )}
                />

                {loadingBoards ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : boardsError ? (
                  <div className="text-red-500 text-center p-6 bg-red-100/10 rounded-lg">
                    {boardsError}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filterComponents(boards).map((board) => (
                      <ComponentCard
                        key={board.id_componente}
                        component={board}
                        category="Motherboard"
                        isSelected={selectedBoard?.id_componente === board.id_componente}
                        onSelect={handleBoardSelect}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}

                {filterComponents(boards).length === 0 && !loadingBoards && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      No se encontraron placas base que coincidan con los filtros.
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Selecciona tu Procesador
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Elige un procesador compatible con tu placa base
                  </p>
                </div>

                <ComponentFilters
                  onFilterChange={handleFilterChange}
                  filters={filters}
                  availableBrands={getAvailableBrands(
                    currentStep === 1 ? boards :
                    currentStep === 2 ? cpus :
                    currentStep === 3 ? gpus :
                    currentStep === 4 ? memory :
                    currentStep === 5 ? disks :
                    currentStep === 6 ? psus :
                    currentStep === 7 ? cases :
                    currentStep === 8 ? monitors : []
                  )}
                />

                {loadingCPUs ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : cpusError ? (
                  <div className="text-red-500 text-center p-6 bg-red-100/10 rounded-lg">
                    {cpusError}
                  </div>
                ) : cpus.length === 0 ? (
                  <div className="text-yellow-500 text-center p-6 bg-yellow-100/10 rounded-lg">
                    No hay procesadores compatibles con esta placa base
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filterComponents(cpus).map((cpu) => (
                      <ComponentCard
                        key={cpu.id_componente}
                        component={cpu}
                        category="CPU"
                        isSelected={selectedCPU?.id_componente === cpu.id_componente}
                        onSelect={handleCPUSelect}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}

                {filterComponents(cpus).length === 0 && !loadingCPUs && cpus.length > 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      No se encontraron procesadores que coincidan con los filtros.
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Selecciona tu Tarjeta Gráfica
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Elige una GPU compatible con tu configuración
                  </p>
                </div>

                <ComponentFilters
                  onFilterChange={handleFilterChange}
                  filters={filters}
                  availableBrands={getAvailableBrands(
                    currentStep === 1 ? boards :
                    currentStep === 2 ? cpus :
                    currentStep === 3 ? gpus :
                    currentStep === 4 ? memory :
                    currentStep === 5 ? disks :
                    currentStep === 6 ? psus :
                    currentStep === 7 ? cases :
                    currentStep === 8 ? monitors : []
                  )}
                />

                {loadingGPUs ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : gpusError ? (
                  <div className="text-red-500 text-center p-6 bg-red-100/10 rounded-lg">
                    {gpusError}
                  </div>
                ) : gpus.length === 0 ? (
                  <div className="text-yellow-500 text-center p-6 bg-yellow-100/10 rounded-lg">
                    No hay tarjetas gráficas compatibles con tu configuración
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filterComponents(gpus).map((gpu) => (
                      <ComponentCard
                        key={gpu.id_componente}
                        component={gpu}
                        category="Video Card"
                        isSelected={selectedGPU?.id_componente === gpu.id_componente}
                        onSelect={handleGPUSelect}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}

                {filterComponents(gpus).length === 0 && !loadingGPUs && gpus.length > 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      No se encontraron tarjetas gráficas que coincidan con los filtros.
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Selecciona tu Memoria RAM
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Elige módulos de RAM compatibles
                  </p>
                </div>

                <ComponentFilters
                  onFilterChange={handleFilterChange}
                  filters={filters}
                  availableBrands={getAvailableBrands(
                    currentStep === 1 ? boards :
                    currentStep === 2 ? cpus :
                    currentStep === 3 ? gpus :
                    currentStep === 4 ? memory :
                    currentStep === 5 ? disks :
                    currentStep === 6 ? psus :
                    currentStep === 7 ? cases :
                    currentStep === 8 ? monitors : []
                  )}
                />

                {loadingMemory ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : memoryError ? (
                  <div className="text-red-500 text-center p-6 bg-red-100/10 rounded-lg">
                    {memoryError}
                  </div>
                ) : memory.length === 0 ? (
                  <div className="text-yellow-500 text-center p-6 bg-yellow-100/10 rounded-lg">
                    No hay memoria RAM compatible con tu configuración
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filterComponents(memory).map((memoryItem) => (
                      <ComponentCard
                        key={memoryItem.id_componente}
                        component={memoryItem}
                        category="Memory"
                        isSelected={selectedMemory?.id_componente === memoryItem.id_componente}
                        onSelect={handleMemorySelect}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}

                {filterComponents(memory).length === 0 && !loadingMemory && memory.length > 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      No se encontró memoria RAM que coincida con los filtros.
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Selecciona tu Almacenamiento
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Elige tu disco duro o SSD
                  </p>
                </div>

                <ComponentFilters
                  onFilterChange={handleFilterChange}
                  filters={filters}
                  availableBrands={getAvailableBrands(
                    currentStep === 1 ? boards :
                    currentStep === 2 ? cpus :
                    currentStep === 3 ? gpus :
                    currentStep === 4 ? memory :
                    currentStep === 5 ? disks :
                    currentStep === 6 ? psus :
                    currentStep === 7 ? cases :
                    currentStep === 8 ? monitors : []
                  )}
                />

                {loadingDisks ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : disksError ? (
                  <div className="text-red-500 text-center p-6 bg-red-100/10 rounded-lg">
                    {disksError}
                  </div>
                ) : disks.length === 0 ? (
                  <div className="text-yellow-500 text-center p-6 bg-yellow-100/10 rounded-lg">
                    No hay unidades de almacenamiento compatibles
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filterComponents(disks).map((disk) => (
                      <ComponentCard
                        key={disk.id_componente}
                        component={disk}
                        category="Storage"
                        isSelected={selectedStorage?.id_componente === disk.id_componente}
                        onSelect={handleStorageSelect}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}

                {filterComponents(disks).length === 0 && !loadingDisks && disks.length > 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      No se encontraron unidades de almacenamiento que coincidan con los filtros.
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Selecciona tu Fuente de Poder
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Elige una PSU adecuada para tu configuración
                  </p>
                </div>

                <ComponentFilters
                  onFilterChange={handleFilterChange}
                  filters={filters}
                  availableBrands={getAvailableBrands(
                    currentStep === 1 ? boards :
                    currentStep === 2 ? cpus :
                    currentStep === 3 ? gpus :
                    currentStep === 4 ? memory :
                    currentStep === 5 ? disks :
                    currentStep === 6 ? psus :
                    currentStep === 7 ? cases :
                    currentStep === 8 ? monitors : []
                  )}
                />

                {loadingPSUs ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : psusError ? (
                  <div className="text-red-500 text-center p-6 bg-red-100/10 rounded-lg">
                    {psusError}
                  </div>
                ) : psus.length === 0 ? (
                  <div className="text-yellow-500 text-center p-6 bg-yellow-100/10 rounded-lg">
                    No hay fuentes de poder compatibles
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filterComponents(psus).map((psu) => (
                      <ComponentCard
                        key={psu.id_componente}
                        component={psu}
                        category="Power Supply"
                        isSelected={selectedPSU?.id_componente === psu.id_componente}
                        onSelect={handlePSUSelect}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}

                {filterComponents(psus).length === 0 && !loadingPSUs && psus.length > 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      No se encontraron fuentes de poder que coincidan con los filtros.
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Selecciona tu Gabinete
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Elige el case para tu PC
                  </p>
                </div>

                <ComponentFilters
                  onFilterChange={handleFilterChange}
                  filters={filters}
                  availableBrands={getAvailableBrands(
                    currentStep === 1 ? boards :
                    currentStep === 2 ? cpus :
                    currentStep === 3 ? gpus :
                    currentStep === 4 ? memory :
                    currentStep === 5 ? disks :
                    currentStep === 6 ? psus :
                    currentStep === 7 ? cases :
                    currentStep === 8 ? monitors : []
                  )}
                />

                {loadingCases ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : casesError ? (
                  <div className="text-red-500 text-center p-6 bg-red-100/10 rounded-lg">
                    {casesError}
                  </div>
                ) : cases.length === 0 ? (
                  <div className="text-yellow-500 text-center p-6 bg-yellow-100/10 rounded-lg">
                    No hay gabinetes compatibles
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filterComponents(cases).map((case_) => (
                      <ComponentCard
                        key={case_.id_componente}
                        component={case_}
                        category="Case"
                        isSelected={selectedCase?.id_componente === case_.id_componente}
                        onSelect={handleCaseSelect}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}

                {filterComponents(cases).length === 0 && !loadingCases && cases.length > 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      No se encontraron gabinetes que coincidan con los filtros.
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 8 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Selecciona tu Monitor
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Elige un monitor para completar tu setup
                  </p>
                </div>

                <ComponentFilters
                  onFilterChange={handleFilterChange}
                  filters={filters}
                  availableBrands={getAvailableBrands(
                    currentStep === 1 ? boards :
                    currentStep === 2 ? cpus :
                    currentStep === 3 ? gpus :
                    currentStep === 4 ? memory :
                    currentStep === 5 ? disks :
                    currentStep === 6 ? psus :
                    currentStep === 7 ? cases :
                    currentStep === 8 ? monitors : []
                  )}
                />

                {loadingMonitors ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : monitorsError ? (
                  <div className="text-red-500 text-center p-6 bg-red-100/10 rounded-lg">
                    {monitorsError}
                  </div>
                ) : monitors.length === 0 ? (
                  <div className="text-yellow-500 text-center p-6 bg-yellow-100/10 rounded-lg">
                    No hay monitores disponibles
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filterComponents(monitors).map((monitor) => (
                      <ComponentCard
                        key={monitor.id_componente}
                        component={monitor}
                        category="Monitor"
                        isSelected={selectedMonitor?.id_componente === monitor.id_componente}
                        onSelect={handleMonitorSelect}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}

                {filterComponents(monitors).length === 0 && !loadingMonitors && monitors.length > 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      No se encontraron monitores que coincidan con los filtros.
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 9 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Resumen de tu Configuración
                </h2>

                {/* Campo para guardar ensamble */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {isEditMode ? 'Actualizar Configuración' : 'Guardar Configuración'}
                  </h3>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nombre de la configuración
                      </label>
                      <input
                        type="text"
                        value={assembleName}
                        onChange={(e) => setAssembleName(e.target.value)}
                        placeholder="Ej: Mi PC Gaming"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="flex items-end">
                        <button
                          onClick={handleSaveAssemble}
                        disabled={isSaving}
                        className={`px-6 py-2 rounded-md font-medium transition-colors ${
                          isSaving
                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isSaving ? (isEditMode ? 'Actualizando...' : 'Guardando...') : (isEditMode ? 'Actualizar' : 'Guardar')}
                      </button>
                    </div>
                  </div>
                  {saveMessage && (
                    <p className={`text-sm ${saveMessage.includes('Error') || saveMessage.includes('Debes') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {saveMessage}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Motherboard */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">Tarjeta Madre</h3>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        ${selectedBoard?.precio || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedBoard?.nombre || 'No seleccionado'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {selectedBoard?.descripcion || ''}
                    </p>
                  </div>

                  {/* CPU */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">Procesador</h3>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        ${selectedCPU?.precio || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedCPU?.nombre || 'No seleccionado'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {selectedCPU?.descripcion || ''}
                    </p>
                  </div>

                  {/* GPU */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">Tarjeta Gráfica</h3>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        ${selectedGPU?.precio || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedGPU?.nombre || 'No seleccionado'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {selectedGPU?.descripcion || ''}
                    </p>
                  </div>

                  {/* RAM */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">Memoria RAM</h3>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        ${selectedMemory?.precio || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedMemory?.nombre || 'No seleccionado'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {selectedMemory?.descripcion || ''}
                    </p>
                  </div>

                  {/* Storage */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">Almacenamiento</h3>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        ${selectedStorage?.precio || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedStorage?.nombre || 'No seleccionado'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {selectedStorage?.descripcion || ''}
                    </p>
                  </div>

                  {/* PSU */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">Fuente de Poder</h3>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        ${selectedPSU?.precio || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedPSU?.nombre || 'No seleccionado'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {selectedPSU?.descripcion || ''}
                    </p>
                  </div>

                  {/* Case */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">Gabinete</h3>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        ${selectedCase?.precio || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedCase?.nombre || 'No seleccionado'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {selectedCase?.descripcion || ''}
                    </p>
                  </div>

                  {/* Monitor */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">Monitor</h3>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        ${selectedMonitor?.precio || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedMonitor?.nombre || 'No seleccionado'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {selectedMonitor?.descripcion || ''}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Precio Total
                      </h3>
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        ${(
                          (selectedBoard?.precio || 0) +
                          (selectedCPU?.precio || 0) +
                          (selectedGPU?.precio || 0) +
                          (selectedMemory?.precio || 0) +
                          (selectedStorage?.precio || 0) +
                          (selectedPSU?.precio || 0) +
                          (selectedCase?.precio || 0) +
                          (selectedMonitor?.precio || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de detalles del componente */}
        <ComponentDetailsModal
          component={selectedComponent}
          category={getStepCategory(currentStep)}
          isOpen={showDetailsModal}
          onClose={handleCloseDetails}
        />
      </div>
      )}
    </div>
  );
};

const ArmarPcPageWithSuspense = () => (
  <Suspense fallback={<div>Cargando...</div>}>
    <ArmarPcPage />
  </Suspense>
);

export default ArmarPcPageWithSuspense;
