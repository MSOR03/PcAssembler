"use client";
import React, { useState, useEffect } from 'react';
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

// Función para obtener información específica por categoría
const getComponentSpecs = (component, category) => {
  const specs = component.especificaciones || {};

  switch (category) {
    case 'CPU':
      return {
        cores: specs['Core Count'] || specs['# of CPU Cores'] || 'N/A',
        threads: specs['Thread Count'] || specs['# of Threads'] || 'N/A',
        baseClock: specs['Base Clock'] || specs['Processor Base Frequency'] || 'N/A',
        boostClock: specs['Boost Clock'] || specs['Max Turbo Frequency'] || 'N/A',
        socket: specs['Socket'] || specs['CPU Socket'] || 'N/A'
      };
    case 'Video Card':
      return {
        vram: specs['VRAM'] || specs['Video Memory'] || 'N/A',
        baseClock: specs['Base Clock'] || specs['Core Clock'] || 'N/A',
        boostClock: specs['Boost Clock'] || specs['Boost Clock (MHz)'] || 'N/A',
        cudaCores: specs['CUDA Cores'] || specs['Stream Processors'] || 'N/A'
      };
    case 'Memory':
      return {
        capacity: specs['Capacity'] || specs['Total Capacity'] || 'N/A',
        speed: specs['Speed'] || specs['Memory Speed'] || 'N/A',
        type: specs['Type'] || specs['Memory Type'] || 'N/A',
        latency: specs['CAS Latency'] || 'N/A'
      };
    case 'Motherboard':
      return {
        socket: specs['Socket'] || specs['CPU Socket'] || 'N/A',
        chipset: specs['Chipset'] || specs['Platform Chipset'] || 'N/A',
        formFactor: specs['Form Factor'] || 'N/A',
        ramSlots: specs['Memory Slots'] || specs['# of Memory Slots'] || 'N/A'
      };
    case 'Storage':
      return {
        capacity: specs['Capacity'] || specs['Total Capacity'] || 'N/A',
        type: specs['Type'] || specs['Form Factor'] || 'N/A',
        interface: specs['Interface'] || 'N/A',
        readSpeed: specs['Sequential Read'] || 'N/A'
      };
    case 'Power Supply':
      return {
        wattage: specs['Wattage'] || specs['Output Wattage'] || 'N/A',
        efficiency: specs['Efficiency'] || specs['Efficiency Rating'] || 'N/A',
        modular: specs['Modular'] || 'N/A'
      };
    case 'Case':
      return {
        formFactor: specs['Motherboard Compatibility'] || specs['Supported Motherboard'] || 'N/A',
        sidePanel: specs['Side Panel'] || 'N/A',
        dimensions: specs['Dimensions'] || 'N/A'
      };
    case 'Monitor':
      return {
        size: specs['Screen Size'] || specs['Display Size'] || 'N/A',
        resolution: specs['Resolution'] || specs['Maximum Resolution'] || 'N/A',
        refreshRate: specs['Refresh Rate'] || specs['Maximum Refresh Rate'] || 'N/A',
        panelType: specs['Panel Type'] || 'N/A'
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
    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
      {Object.entries(specs).map(([key, value]) => (
        <div key={key} className="flex justify-between">
          <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
          <span className="font-medium">{value}</span>
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
        <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-1 z-10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            e.target.src = '/images/default.jpg';
          }}
        />
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Marca y precio */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
            {component.marca}
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ${component.precio}
          </span>
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
          className="w-full mt-3 px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
        >
          Ver Detalles
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
                  e.target.src = '/images/default.jpg';
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
const ComponentFilters = ({ onFilterChange, filters }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Buscar por nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Buscar
          </label>
          <input
            type="text"
            placeholder="Nombre del componente..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          />
        </div>

        {/* Filtrar por marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Marca
          </label>
          <input
            type="text"
            placeholder="Ej: ASUS, Intel..."
            value={filters.brand || ''}
            onChange={(e) => onFilterChange('brand', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          />
        </div>

        {/* Precio mínimo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Precio Mín
          </label>
          <input
            type="number"
            placeholder="0"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          />
        </div>

        {/* Precio máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Precio Máx
          </label>
          <input
            type="number"
            placeholder="5000"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          />
        </div>
      </div>

      {/* Botón de limpiar filtros */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => onFilterChange('clear')}
          className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
};

const ArmarPcPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  
  useEffect(() => {
    // Reiniciar todos los estados cuando cambie el type
    setCurrentStep(1);
    setSelectedBoard(null);
    setSelectedCPU(null);
    setSelectedGPU(null);
    setSelectedMemory(null);
    setSelectedPSU(null);
    setSelectedStorage(null);
    setSelectedCase(null);
    setSelectedPeripherals(null);
    setSelectedMonitor(null);
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
  }, [type]);

  const { boards, loading: loadingBoards, error: boardsError } = useBoards();

  

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedCPU, setSelectedCPU] = useState(null);
  const [selectedGPU, setSelectedGPU] = useState(null);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [selectedPSU, setSelectedPSU] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedPeripherals, setSelectedPeripherals] = useState(null);
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
    currentStep === 7 ? formData.procesador : null,
    currentStep === 7 ? formData.gpu : null,
    currentStep === 7 ? formData.ram : null,
    currentStep === 7 ? formData.almacenamiento : null,
    currentStep === 7 ? formData.fuente : null
  );

  // Solo llamar a useCompatibleMonitors cuando estemos en el paso 8
  const { monitors, loading: loadingMonitors, error: monitorsError } = useCompatibleMonitors(
    currentStep === 8 ? formData.motherboard : null,
    currentStep === 8 ? formData.procesador : null,
    currentStep === 8 ? formData.gpu : null,
    currentStep === 8 ? formData.ram : null,
    currentStep === 8 ? formData.almacenamiento : null,
    currentStep === 8 ? formData.fuente : null,
    currentStep === 8 ? formData.gabinete : null
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
  };

  const handleCPUSelect = (cpu) => {
    setSelectedCPU(cpu);
    setFormData(prev => ({
      ...prev,
      procesador: cpu.id_componente
    }));
  };

  const handleGPUSelect = (gpu) => {
    setSelectedGPU(gpu);
    setFormData(prev => ({
      ...prev,
      gpu: gpu.id_componente
    }));
  };

  const handleMemorySelect = (memoryItem) => {
    setSelectedMemory(memoryItem);
    setFormData(prev => ({
      ...prev,
      ram: memoryItem.id_componente
    }));
  };

  const handlePSUSelect = (psu) => {
    setSelectedPSU(psu);
    setFormData(prev => ({
      ...prev,
      fuente: psu.id_componente
    }));
  };

  const handleStorageSelect = (storage) => {
    setSelectedStorage(storage);
    setFormData(prev => ({
      ...prev,
      almacenamiento: storage.id_componente
    }));
  };

  const handleCaseSelect = (case_) => {
    setSelectedCase(case_);
    setFormData(prev => ({
      ...prev,
      gabinete: case_.id_componente
    }));
  };


  const handleMonitorSelect = (monitor) => {
    setSelectedMonitor(monitor);
    setFormData(prev => ({
      ...prev,
      monitor: monitor.id_componente
    }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos
    console.log(formData);
  };


  useEffect(() => {
    const handlePcType = () => {
      if (!boards?.length > 0) return;

      let selectedIndex = 0;
      
      switch(type) {
        case 'gaming':
          // Gaming - seleccionamos componentes de alto rendimiento
          selectedIndex = 0; // Asumimos que el primer componente es el de más alto rendimiento
          break;
        case 'workstation':
          // Workstation - balance entre rendimiento y estabilidad
          selectedIndex = Math.min(1, boards.length - 1); // Segundo componente o el último si solo hay uno
          break;
        case 'streaming':
          // Streaming - enfoque en CPU y RAM
          selectedIndex = Math.min(2, boards.length - 1); // Tercer componente o el último disponible
          break;
        case 'basic':
          // Configuración básica - componentes más económicos
          selectedIndex = boards.length - 1; // Último componente (asumiendo que está ordenado por precio)
          break;
        default:
          return; // Si no hay tipo específico, no hacemos selección automática
      }

      // Seleccionamos la placa base según el tipo
      setSelectedBoard(boards[selectedIndex]);
      setFormData(prev => ({
        ...prev,
        motherboard: boards[selectedIndex].id_componente
      }));
      setCurrentStep(2); // Avanzamos al siguiente paso para activar la carga de CPUs
    };

    handlePcType();
  }, [type, boards]);

  // Efecto para CPU después de seleccionar placa base
  useEffect(() => {
    const handleCpuSelection = () => {
      if (!cpus?.length > 0 || !selectedBoard) return;

      let selectedIndex = 0;
      
      switch(type) {
        case 'gaming':
          selectedIndex = 0; // CPU más potente para gaming
          break;
        case 'workstation':
          selectedIndex = Math.min(1, cpus.length - 1); // CPU balanceado
          break;
        case 'streaming':
          selectedIndex = 0; // CPU potente para streaming
          break;
        case 'basic':
          selectedIndex = cpus.length - 1; // CPU más económico
          break;
        default:
          return;
      }

      setSelectedCPU(cpus[selectedIndex]);
      setFormData(prev => ({
        ...prev,
        procesador: cpus[selectedIndex].id_componente
      }));
      setCurrentStep(3);
    };

    handleCpuSelection();
  }, [type, selectedBoard, cpus]);

  // Efecto para GPU
  useEffect(() => {
    const handleGpuSelection = () => {
      if (!gpus?.length > 0 || !selectedCPU) return;

      let selectedIndex = 0;
      
      switch(type) {
        case 'gaming':
          selectedIndex = 0; // GPU más potente para gaming
          break;
        case 'workstation':
          selectedIndex = Math.min(1, gpus.length - 1); // GPU balanceada
          break;
        case 'streaming':
          selectedIndex = Math.min(1, gpus.length - 1); // GPU media para streaming
          break;
        case 'basic':
          selectedIndex = gpus.length - 1; // GPU básica
          break;
        default:
          return;
      }

      setSelectedGPU(gpus[selectedIndex]);
      setFormData(prev => ({
        ...prev,
        gpu: gpus[selectedIndex].id_componente
      }));
      setCurrentStep(4);
    };

    handleGpuSelection();
  }, [type, selectedCPU, gpus]);

  // Efecto para memoria
  useEffect(() => {
    const handleMemorySelection = () => {
      if (!memory?.length > 0 || !selectedGPU) return;

      let selectedIndex = 0;
      
      switch(type) {
        case 'gaming':
          selectedIndex = 0; // Memoria más rápida para gaming
          break;
        case 'workstation':
          selectedIndex = 0; // Memoria de alta capacidad para workstation
          break;
        case 'streaming':
          selectedIndex = 0; // Memoria de alta capacidad para streaming
          break;
        case 'basic':
          selectedIndex = memory.length - 1; // Memoria básica
          break;
        default:
          return;
      }

      setSelectedMemory(memory[selectedIndex]);
      setFormData(prev => ({
        ...prev,
        ram: memory[selectedIndex].id_componente
      }));
      setCurrentStep(5);
    };

    handleMemorySelection();
  }, [type, selectedGPU, memory]);

  // Efecto para almacenamiento
  useEffect(() => {
    const handleStorageSelection = () => {
      if (!disks?.length > 0 || !selectedMemory) return;

      let selectedIndex = 0;
      
      switch(type) {
        case 'gaming':
          selectedIndex = 0; // SSD rápido para gaming
          break;
        case 'workstation':
          selectedIndex = 0; // Almacenamiento de alta capacidad
          break;
        case 'streaming':
          selectedIndex = 0; // Almacenamiento rápido para streaming
          break;
        case 'basic':
          selectedIndex = disks.length - 1; // Almacenamiento básico
          break;
        default:
          return;
      }

      setSelectedStorage(disks[selectedIndex]);
      setFormData(prev => ({
        ...prev,
        almacenamiento: disks[selectedIndex].id_componente
      }));
      setCurrentStep(6);
    };

    handleStorageSelection();
  }, [type, selectedMemory, disks]);

  // Efecto para PSU
  useEffect(() => {
    const handlePsuSelection = () => {
      if (!psus?.length > 0 || !selectedStorage) return;

      let selectedIndex = 0;
      
      switch(type) {
        case 'gaming':
          selectedIndex = 0; // PSU de alta potencia para gaming
          break;
        case 'workstation':
          selectedIndex = 0; // PSU de alta potencia para workstation
          break;
        case 'streaming':
          selectedIndex = Math.min(1, psus.length - 1); // PSU media para streaming
          break;
        case 'basic':
          selectedIndex = psus.length - 1; // PSU básica
          break;
        default:
          return;
      }

      setSelectedPSU(psus[selectedIndex]);
      setFormData(prev => ({
        ...prev,
        fuente: psus[selectedIndex].id_componente
      }));
      setCurrentStep(7);
    };

    handlePsuSelection();
  }, [type, selectedStorage, psus]);

  // Efecto para Case
  useEffect(() => {
    const handleCaseSelection = () => {
      if (!cases?.length > 0 || !selectedPSU) return;

      let selectedIndex = 0;
      
      switch(type) {
        case 'gaming':
          selectedIndex = 0; // Case gaming con mejor airflow
          break;
        case 'workstation':
          selectedIndex = Math.min(1, cases.length - 1); // Case espacioso para workstation
          break;
        case 'streaming':
          selectedIndex = Math.min(1, cases.length - 1); // Case medio para streaming
          break;
        case 'basic':
          selectedIndex = cases.length - 1; // Case básico
          break;
        default:
          return;
      }

      setSelectedCase(cases[selectedIndex]);
      setFormData(prev => ({
        ...prev,
        gabinete: cases[selectedIndex].id_componente
      }));
      setCurrentStep(8);
    };

    handleCaseSelection();
  }, [type, selectedPSU, cases]);

  // Efecto final para Monitor
  useEffect(() => {
    const handleMonitorSelection = () => {
      if (!monitors?.length > 0 || !selectedCase) return;

      let selectedIndex = 0;
      
      switch(type) {
        case 'gaming':
          selectedIndex = 0; // Monitor gaming de alta frecuencia
          break;
        case 'workstation':
          selectedIndex = Math.min(1, monitors.length - 1); // Monitor de alta resolución
          break;
        case 'streaming':
          selectedIndex = Math.min(1, monitors.length - 1); // Monitor de buena calidad
          break;
        case 'basic':
          selectedIndex = monitors.length - 1; // Monitor básico
          break;
        default:
          return;
      }

      setSelectedMonitor(monitors[selectedIndex]);
      setFormData(prev => ({
        ...prev,
        monitor: monitors[selectedIndex].id_componente
      }));
      setCurrentStep(9);
    };

    handleMonitorSelection();
  }, [type, selectedCase, monitors]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Arma tu PC
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sigue los pasos para configurar tu PC ideal
          </p>
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
        <div className="bg-white dark:bg-[#1e293b] rounded-lg p-8 shadow-lg">
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
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
                  ${currentStep === 1 
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                disabled={currentStep === 1}
              >
                Anterior
              </button>
              
              <button
                type={currentStep === 9 ? 'submit' : 'button'}
                onClick={currentStep === 9 ? handleSubmit : handleNext}
                disabled={(currentStep === 1 && !selectedBoard) || 
                        (currentStep === 2 && !selectedCPU) ||
                        (currentStep === 3 && !selectedGPU) ||
                        (currentStep === 4 && !selectedMemory) ||
                        (currentStep === 5 && !selectedStorage) ||
                        (currentStep === 6 && !selectedPSU) ||
                        (currentStep === 7 && !selectedCase) ||
                        (currentStep === 8 && !selectedMonitor)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
                  ${((currentStep === 1 && !selectedBoard) || 
                    (currentStep === 2 && !selectedCPU) ||
                    (currentStep === 3 && !selectedGPU) ||
                    (currentStep === 4 && !selectedMemory) ||
                    (currentStep === 5 && !selectedStorage) ||
                    (currentStep === 6 && !selectedPSU) ||
                    (currentStep === 7 && !selectedCase) ||
                    (currentStep === 8 && !selectedMonitor))
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                {currentStep === 9 ? 'Finalizar' : 'Siguiente'}
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

                <ComponentFilters onFilterChange={handleFilterChange} filters={filters} />

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

                <ComponentFilters onFilterChange={handleFilterChange} filters={filters} />

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

                <ComponentFilters onFilterChange={handleFilterChange} filters={filters} />

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

                <ComponentFilters onFilterChange={handleFilterChange} filters={filters} />

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

                <ComponentFilters onFilterChange={handleFilterChange} filters={filters} />

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

                <ComponentFilters onFilterChange={handleFilterChange} filters={filters} />

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

                <ComponentFilters onFilterChange={handleFilterChange} filters={filters} />

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

                <ComponentFilters onFilterChange={handleFilterChange} filters={filters} />

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
                {loadingGPUs ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : gpusError ? (
                  <div className="text-red-500 text-center p-4 bg-red-100/10 rounded-md">
                    {gpusError}
                  </div>
                ) : gpus.length === 0 ? (
                  <div className="text-yellow-500 text-center p-4 bg-yellow-100/10 rounded-md">
                    No hay tarjetas gráficas compatibles con tu configuración
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {gpus.map((gpu) => (
                      <div 
                        key={gpu.id_componente}
                        onClick={() => handleGPUSelect(gpu)}
                        className={`p-4 rounded-lg transition-all cursor-pointer
                          ${selectedGPU?.id_componente === gpu.id_componente
                            ? 'bg-blue-600 ring-2 ring-blue-400 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white'}`}
                      >
                        <div className="flex gap-4">
                          <div className="w-32 h-32 flex-shrink-0 relative">
                            <Image
                              src={getImageUrl(gpu.imagenUrl)}
                              alt={gpu.nombre}
                              width={128}
                              height={128}
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{gpu.nombre}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{gpu.descripcion}</p>
                              </div>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">${gpu.precio}</p>
                            </div>
                            {selectedGPU?.id_componente === gpu.id_componente && (
                              <div className="mt-2 text-white dark:text-blue-200 text-sm">
                                ✓ Seleccionado
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Selecciona tu Memoria RAM
                </h2>
                {loadingMemory ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : memoryError ? (
                  <div className="text-red-500 text-center p-4 bg-red-100/10 rounded-md">
                    {memoryError}
                  </div>
                ) : memory.length === 0 ? (
                  <div className="text-yellow-500 text-center p-4 bg-yellow-100/10 rounded-md">
                    No hay memoria RAM compatible con tu configuración
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {memory.map((memoryItem) => (
                      <div 
                        key={memoryItem.id_componente}
                        onClick={() => handleMemorySelect(memoryItem)}
                        className={`p-4 rounded-lg transition-all cursor-pointer
                          ${selectedMemory?.id_componente === memoryItem.id_componente
                            ? 'bg-blue-600 ring-2 ring-blue-400 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white'}`}
                      >
                        <div className="flex gap-4">
                          <div className="w-32 h-32 flex-shrink-0 relative">
                            <Image
                              src={getImageUrl(memoryItem.imagenUrl)}
                              alt={memoryItem.nombre}
                              width={128}
                              height={128}
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{memoryItem.nombre}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{memoryItem.descripcion}</p>
                              </div>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">${memoryItem.precio}</p>
                            </div>
                            {selectedMemory?.id_componente === memoryItem.id_componente && (
                              <div className="mt-2 text-white dark:text-blue-200 text-sm">
                                ✓ Seleccionado
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {currentStep === 5 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Selecciona tu Disco Duro
                </h2>
                {loadingDisks ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : disksError ? (
                  <div className="text-red-500 text-center p-4 bg-red-100/10 rounded-md">
                    {disksError}
                  </div>
                ) : disks.length === 0 ? (
                  <div className="text-yellow-500 text-center p-4 bg-yellow-100/10 rounded-md">
                    No hay discos duros compatibles con tu configuración
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {disks.map((disk) => (
                      <div 
                        key={disk.id_componente}
                        onClick={() => handleStorageSelect(disk)}
                        className={`p-4 rounded-lg transition-all cursor-pointer
                          ${selectedStorage?.id_componente === disk.id_componente
                            ? 'bg-blue-600 ring-2 ring-blue-400 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white'}`}
                      >
                        <div className="flex gap-4">
                          <div className="w-32 h-32 flex-shrink-0 relative">
                            <Image
                              src={getImageUrl(disk.imagenUrl)}
                              alt={disk.nombre}
                              width={128}
                              height={128}
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{disk.nombre}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{disk.descripcion}</p>
                              </div>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">${disk.precio}</p>
                            </div>
                            {selectedStorage?.id_componente === disk.id_componente && (
                              <div className="mt-2 text-white dark:text-blue-200 text-sm">
                                ✓ Seleccionado
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Selecciona tu Fuente de Poder
                </h2>
                {loadingPSUs ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : psusError ? (
                  <div className="text-red-500 text-center p-4 bg-red-100/10 rounded-md">
                    {psusError}
                  </div>
                ) : psus.length === 0 ? (
                  <div className="text-yellow-500 text-center p-4 bg-yellow-100/10 rounded-md">
                    No hay fuentes de poder compatibles con tu configuración
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {psus.map((psu) => (
                      <div 
                        key={psu.id_componente}
                        onClick={() => handlePSUSelect(psu)}
                        className={`p-4 rounded-lg transition-all cursor-pointer
                          ${selectedPSU?.id_componente === psu.id_componente
                            ? 'bg-blue-600 ring-2 ring-blue-400 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white'}`}
                      >
                        <div className="flex gap-4">
                          <div className="w-32 h-32 flex-shrink-0 relative">
                            <Image
                              src={getImageUrl(psu.imagenUrl)}
                              alt={psu.nombre}
                              width={128}
                              height={128}
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{psu.nombre}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{psu.descripcion}</p>
                              </div>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">${psu.precio}</p>
                            </div>
                            {selectedPSU?.id_componente === psu.id_componente && (
                              <div className="mt-2 text-white dark:text-blue-200 text-sm">
                                ✓ Seleccionado
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Selecciona tu Gabinete
                </h2>
                {loadingCases ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : casesError ? (
                  <div className="text-red-500 text-center p-4 bg-red-100/10 rounded-md">
                    {casesError}
                  </div>
                ) : cases.length === 0 ? (
                  <div className="text-yellow-500 text-center p-4 bg-yellow-100/10 rounded-md">
                    No hay gabinetes compatibles con tu configuración
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {cases.map((case_) => (
                      <div 
                        key={case_.id_componente}
                        onClick={() => handleCaseSelect(case_)}
                        className={`p-4 rounded-lg transition-all cursor-pointer
                          ${selectedCase?.id_componente === case_.id_componente
                            ? 'bg-blue-600 ring-2 ring-blue-400 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white'}`}
                      >
                        <div className="flex gap-4">
                          <div className="w-32 h-32 flex-shrink-0 relative">
                            <Image
                              src={getImageUrl(case_.imagenUrl)}
                              alt={case_.nombre}
                              width={128}
                              height={128}
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{case_.nombre}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{case_.descripcion}</p>
                              </div>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">${case_.precio}</p>
                            </div>
                            {selectedCase?.id_componente === case_.id_componente && (
                              <div className="mt-2 text-white dark:text-blue-200 text-sm">
                                ✓ Seleccionado
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 8 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Selecciona tu Monitor
                </h2>
                {loadingMonitors ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : monitorsError ? (
                  <div className="text-red-500 text-center p-4 bg-red-100/10 rounded-md">
                    {monitorsError}
                  </div>
                ) : monitors.length === 0 ? (
                  <div className="text-yellow-500 text-center p-4 bg-yellow-100/10 rounded-md">
                    No hay monitores compatibles con tu configuración
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {monitors.map((monitor) => (
                      <div 
                        key={monitor.id_componente}
                        onClick={() => handleMonitorSelect(monitor)}
                        className={`p-4 rounded-lg transition-all cursor-pointer
                          ${selectedMonitor?.id_componente === monitor.id_componente
                            ? 'bg-blue-600 ring-2 ring-blue-400 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white'}`}
                      >
                        <div className="flex gap-4">
                          <div className="w-32 h-32 flex-shrink-0 relative">
                            <Image
                              src={getImageUrl(monitor.imagenUrl)}
                              alt={monitor.nombre}
                              width={128}
                              height={128}
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{monitor.nombre}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{monitor.descripcion}</p>
                              </div>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">${monitor.precio}</p>
                            </div>
                            {selectedMonitor?.id_componente === monitor.id_componente && (
                              <div className="mt-2 text-white dark:text-blue-200 text-sm">
                                ✓ Seleccionado
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 9 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Resumen de tu Configuración
                </h2>
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
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrevious}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
                  ${currentStep === 1 
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                disabled={currentStep === 1}
              >
                Anterior
              </button>
              
              <button
                type={currentStep === 9 ? 'submit' : 'button'}
                onClick={currentStep === 9 ? handleSubmit : handleNext}
                disabled={(currentStep === 1 && !selectedBoard) || 
                        (currentStep === 2 && !selectedCPU) ||
                        (currentStep === 3 && !selectedGPU) ||
                        (currentStep === 4 && !selectedMemory) ||
                        (currentStep === 5 && !selectedStorage) ||
                        (currentStep === 6 && !selectedPSU) ||
                        (currentStep === 7 && !selectedCase) ||
                        (currentStep === 8 && !selectedMonitor)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
                  ${((currentStep === 1 && !selectedBoard) || 
                    (currentStep === 2 && !selectedCPU) ||
                    (currentStep === 3 && !selectedGPU) ||
                    (currentStep === 4 && !selectedMemory) ||
                    (currentStep === 5 && !selectedStorage) ||
                    (currentStep === 6 && !selectedPSU) ||
                    (currentStep === 7 && !selectedCase) ||
                    (currentStep === 8 && !selectedMonitor))
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                {currentStep === 9 ? 'Finalizar' : 'Siguiente'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Función auxiliar para obtener la categoría según el paso
  function getStepCategory(step) {
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
  }

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
    } catch (error) {
      console.error('Error al guardar el ensamble:', error);
      setSaveMessage(error.response?.data?.error || 'Error al guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Arma tu PC
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sigue los pasos para configurar tu PC ideal
          </p>

          {/* Precio Total en Tiempo Real */}
          <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg border border-gray-200 dark:border-gray-700 mt-6">
            <span className="text-gray-600 dark:text-gray-400 mr-3">Total actual:</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
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
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 shadow-md'}`}
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
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${(currentStep / 9) * 100}%` }}
                  ></div>
                </div>
              </div>

              <button
                type={currentStep === 9 ? 'submit' : 'button'}
                onClick={currentStep === 9 ? handleSubmit : handleNext}
                disabled={(currentStep === 1 && !selectedBoard) ||
                        (currentStep === 2 && !selectedCPU) ||
                        (currentStep === 3 && !selectedGPU) ||
                        (currentStep === 4 && !selectedMemory) ||
                        (currentStep === 5 && !selectedStorage) ||
                        (currentStep === 6 && !selectedPSU) ||
                        (currentStep === 7 && !selectedCase) ||
                        (currentStep === 8 && !selectedMonitor)}
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
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-md'}`}
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

                <ComponentFilters onFilterChange={handleFilterChange} filters={filters} />

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

                <ComponentFilters onFilterChange={handleFilterChange} filters={filters} />

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

            {currentStep === 9 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Resumen de tu Configuración
                </h2>

                {/* Campo para guardar ensamble */}
                {token && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Guardar Configuración
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
                          {isSaving ? 'Guardando...' : 'Guardar'}
                        </button>
                      </div>
                    </div>
                    {saveMessage && (
                      <p className={`text-sm ${saveMessage.includes('Error') || saveMessage.includes('Debes') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {saveMessage}
                      </p>
                    )}
                  </div>
                )}

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
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrevious}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
                  ${currentStep === 1
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                disabled={currentStep === 1}
              >
                Anterior
              </button>

              <button
                type={currentStep === 9 ? 'submit' : 'button'}
                onClick={currentStep === 9 ? handleSubmit : handleNext}
                disabled={(currentStep === 1 && !selectedBoard) ||
                        (currentStep === 2 && !selectedCPU) ||
                        (currentStep === 3 && !selectedGPU) ||
                        (currentStep === 4 && !selectedMemory) ||
                        (currentStep === 5 && !selectedStorage) ||
                        (currentStep === 6 && !selectedPSU) ||
                        (currentStep === 7 && !selectedCase) ||
                        (currentStep === 8 && !selectedMonitor)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
                  ${((currentStep === 1 && !selectedBoard) ||
                    (currentStep === 2 && !selectedCPU) ||
                    (currentStep === 3 && !selectedGPU) ||
                    (currentStep === 4 && !selectedMemory) ||
                    (currentStep === 5 && !selectedStorage) ||
                    (currentStep === 6 && !selectedPSU) ||
                    (currentStep === 7 && !selectedCase) ||
                    (currentStep === 8 && !selectedMonitor))
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                {currentStep === 9 ? 'Finalizar' : 'Siguiente'}
              </button>
            </div>
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
    </div>
  );
};