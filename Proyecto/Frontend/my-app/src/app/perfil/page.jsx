'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ProfileCard = ({ title, children }) => (
  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6">
    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
      {title}
    </h2>
    {children}
  </div>
);

const ConfigurationCard = ({ config, index, onDelete, onEdit, onShare, onViewDetails }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transform hover:scale-105">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
          {config.nombre}
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Configuración completa</span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          ${config.totalPrice}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Total estimado</p>
      </div>
    </div>

    {/* Botones de acciones */}
    <div className="flex gap-2 mb-4 flex-wrap">
      <button
        onClick={() => onViewDetails(config)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Ver Detalles
      </button>
      <button
        onClick={() => onEdit(config)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Editar
      </button>
      <button
        onClick={() => onShare(config)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
        Compartir
      </button>
      <button
        onClick={() => onDelete(config)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Eliminar
      </button>
    </div>
    <div className="space-y-3 text-sm">
      <div className="flex justify-between items-center p-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
        <span className="text-gray-600 dark:text-gray-400 font-medium">🖥️ Tarjeta Madre:</span>
        <span className="text-gray-900 dark:text-white font-semibold">{config.motherboard || 'No seleccionado'}</span>
      </div>
      <div className="flex justify-between items-center p-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
        <span className="text-gray-600 dark:text-gray-400 font-medium">⚡ Procesador:</span>
        <span className="text-gray-900 dark:text-white font-semibold">{config.cpu || 'No seleccionado'}</span>
      </div>
      <div className="flex justify-between items-center p-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
        <span className="text-gray-600 dark:text-gray-400 font-medium">🎮 Tarjeta Gráfica:</span>
        <span className="text-gray-900 dark:text-white font-semibold">{config.gpu || 'No seleccionado'}</span>
      </div>
      <div className="flex justify-between items-center p-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
        <span className="text-gray-600 dark:text-gray-400 font-medium">🧠 Memoria RAM:</span>
        <span className="text-gray-900 dark:text-white font-semibold">{config.ram || 'No seleccionado'}</span>
      </div>
      <div className="flex justify-between items-center p-2 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg">
        <span className="text-gray-600 dark:text-gray-400 font-medium">💾 Disco Duro:</span>
        <span className="text-gray-900 dark:text-white font-semibold">{config.storage || 'No seleccionado'}</span>
      </div>
      <div className="flex justify-between items-center p-2 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-lg">
        <span className="text-gray-600 dark:text-gray-400 font-medium">🔌 Fuente:</span>
        <span className="text-gray-900 dark:text-white font-semibold">{config.psu || 'No seleccionado'}</span>
      </div>
      <div className="flex justify-between items-center p-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
        <span className="text-gray-600 dark:text-gray-400 font-medium">📦 Gabinete:</span>
        <span className="text-gray-900 dark:text-white font-semibold">{config.case || 'No seleccionado'}</span>
      </div>
      <div className="flex justify-between items-center p-2 bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 rounded-lg">
        <span className="text-gray-600 dark:text-gray-400 font-medium">🖥️ Monitor:</span>
        <span className="text-gray-900 dark:text-white font-semibold">{config.monitor || 'No seleccionado'}</span>
      </div>
    </div>
  </div>
);


const ProfilePage = () => {
  const { user, token } = useAuth();
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Estados para evaluación de IA
  const [selectedEvaluationConfig, setSelectedEvaluationConfig] = useState(null);
  const [aiEvaluation, setAiEvaluation] = useState(null);
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [sharedLink, setSharedLink] = useState(null);

  useEffect(() => {
    const fetchEnsambles = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3001/api/obtener-ensambles-usuario', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Transformar los datos del backend al formato esperado por el componente
        const transformedConfigurations = response.data.ensambles.map((ensamble) => ({
          id: ensamble.id_ensamble,
          nombre: ensamble.nombre_ensamble,
          totalPrice: ensamble.costo_total,
          motherboard: ensamble.componentes['Motherboard']?.nombre || 'No seleccionado',
          motherboardData: ensamble.componentes['Motherboard'] || null,
          cpu: ensamble.componentes['CPU']?.nombre || 'No seleccionado',
          cpuData: ensamble.componentes['CPU'] || null,
          gpu: ensamble.componentes['Video Card']?.nombre || 'No seleccionado',
          gpuData: ensamble.componentes['Video Card'] || null,
          ram: ensamble.componentes['Memory']?.nombre || 'No seleccionado',
          ramData: ensamble.componentes['Memory'] || null,
          storage: ensamble.componentes['Storage']?.nombre || 'No seleccionado',
          storageData: ensamble.componentes['Storage'] || null,
          psu: ensamble.componentes['Power Supply']?.nombre || 'No seleccionado',
          psuData: ensamble.componentes['Power Supply'] || null,
          case: ensamble.componentes['Case']?.nombre || 'No seleccionado',
          caseData: ensamble.componentes['Case'] || null,
          monitor: ensamble.componentes['Monitor']?.nombre || 'No seleccionado',
          monitorData: ensamble.componentes['Monitor'] || null,
        }));

        setConfigurations(transformedConfigurations);
      } catch (error) {
        console.error('Error al obtener ensambles:', error);
        setError('Error al cargar las configuraciones guardadas');
      } finally {
        setLoading(false);
      }
    };

    fetchEnsambles();
  }, [token]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteEnsamble = async (config) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la configuración "${config.nombre}"?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/api/eliminar-ensamble/${config.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Remover del estado local
      setConfigurations(prev => prev.filter(c => c.id !== config.id));
      showToast(`Configuración "${config.nombre}" eliminada exitosamente`, 'success');
    } catch (error) {
      console.error('Error al eliminar ensamble:', error);
      showToast('Error al eliminar la configuración', 'error');
    }
  };

  const handleEditEnsamble = (config) => {
    // Redirigir a armar-pc con el ID del ensamble para editar
    window.location.href = `/armar-pc?edit=${config.id}`;
  };

  const handleViewDetails = async (config) => {
    setSelectedConfig(config);
    setShowDetailsModal(true);
    
    // Intentar cargar evaluación guardada
    try {
      const response = await axios.get(
        `http://localhost:3001/api/evaluacion-ensamble/${config.id}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setAiEvaluation(response.data.evaluacion);
        setSelectedEvaluationConfig(config);
      }
    } catch (error) {
      // No hay evaluación guardada, no hacer nada
      setAiEvaluation(null);
    }
  };

  const handleShareEnsamble = async (config) => {
    // Intentar obtener la evaluación de IA si existe
    let evaluacion = null;
    try {
      const response = await axios.get(
        `http://localhost:3001/api/evaluacion-ensamble/${config.id}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      if (response.data.success) {
        evaluacion = response.data.evaluacion;
      }
    } catch (error) {
      // No hay evaluación, continuar sin ella
    }

    // Construir texto para compartir con formato bonito
    let shareText = `═══════════════════════════════════════\n`;
    shareText += `🖥️  ${config.nombre.toUpperCase()}\n`;
    shareText += `═══════════════════════════════════════\n\n`;
    
    shareText += `💰 PRECIO TOTAL: $${config.totalPrice}\n\n`;
    
    shareText += `⚙️  COMPONENTES:\n`;
    shareText += `───────────────────────────────────────\n`;
    shareText += `🖥️  Motherboard:  ${config.motherboard}\n`;
    shareText += `⚡  Procesador:   ${config.cpu}\n`;
    shareText += `🎮  GPU:          ${config.gpu}\n`;
    shareText += `🧠  RAM:          ${config.ram}\n`;
    shareText += `💾  Almacenamiento: ${config.storage}\n`;
    shareText += `🔌  Fuente:       ${config.psu}\n`;
    shareText += `📦  Gabinete:     ${config.case}\n`;
    shareText += `🖥️  Monitor:      ${config.monitor}\n`;

    if (evaluacion) {
      shareText += `\n═══════════════════════════════════════\n`;
      shareText += `🤖  EVALUACIÓN DE IA\n`;
      shareText += `═══════════════════════════════════════\n\n`;
      
      if (evaluacion.puntuacion_general) {
        shareText += `⭐ Puntuación: ${evaluacion.puntuacion_general}/10\n\n`;
      }
      
      if (evaluacion.resumen) {
        shareText += `📝 ${evaluacion.resumen}\n\n`;
      }
      
      if (evaluacion.uso_recomendado && evaluacion.uso_recomendado.length > 0) {
        shareText += `🎯 Uso Recomendado:\n`;
        evaluacion.uso_recomendado.forEach(uso => {
          shareText += `   • ${uso}\n`;
        });
        shareText += `\n`;
      }
      
      if (evaluacion.compatibilidad && evaluacion.compatibilidad.estado) {
        shareText += `🔧 Compatibilidad: ${evaluacion.compatibilidad.estado}\n\n`;
      }
      
      if (evaluacion.puntos_fuertes && evaluacion.puntos_fuertes.length > 0) {
        shareText += `✅ Puntos Fuertes:\n`;
        evaluacion.puntos_fuertes.forEach(punto => {
          shareText += `   • ${punto}\n`;
        });
        shareText += `\n`;
      }
      
      if (evaluacion.recomendaciones && evaluacion.recomendaciones.length > 0) {
        shareText += `💡 Recomendaciones:\n`;
        evaluacion.recomendaciones.forEach(rec => {
          shareText += `   • ${rec}\n`;
        });
        shareText += `\n`;
      }
    }

    shareText += `═══════════════════════════════════════\n`;
    shareText += `Creado con PC Assembler 🚀\n`;

    navigator.clipboard.writeText(shareText).then(() => {
      showToast('Configuración copiada al portapapeles', 'success');
    }).catch(() => {
      showToast('No se pudo copiar al portapapeles', 'error');
    });
  };

  const handleEvaluateWithAI = async (config) => {
    setSelectedEvaluationConfig(config);
    setEvaluationLoading(true);
    setAiEvaluation(null);

    try {
      const response = await axios.post(
        'http://localhost:3001/api/evaluar-ensamble',
        { ensambleId: config.id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setAiEvaluation(response.data.evaluacion);
      showToast('Evaluación completada exitosamente', 'success');
    } catch (error) {
      console.error('Error al evaluar con IA:', error);
      showToast(error.response?.data?.error || 'Error al evaluar el ensamble', 'error');
    } finally {
      setEvaluationLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    showToast('Generando PDF...', 'success');

    try {
      const modalElement = document.querySelector('.modal-content-for-pdf');
      
      if (!modalElement) {
        showToast('Error: No se encontró el contenido del modal', 'error');
        return;
      }

      // Configuración para captura de alta calidad
      const canvas = await html2canvas(modalElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Agregar primera página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Agregar páginas adicionales si es necesario
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Descargar el PDF
      const fileName = `${selectedConfig.nombre.replace(/\s+/g, '_')}_Ensamble.pdf`;
      pdf.save(fileName);
      
      showToast('PDF generado exitosamente', 'success');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      showToast('Error al generar el PDF', 'error');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleGenerateShareLink = async (config) => {
    setGeneratingLink(true);
    showToast('Generando link público...', 'success');

    try {
      const response = await axios.post(
        `http://localhost:3001/api/share-ensamble/${config.id}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const shareUrl = response.data.shareUrl;
      setSharedLink(shareUrl);

      // Copiar al portapapeles
      await navigator.clipboard.writeText(shareUrl);
      showToast('Link copiado al portapapeles', 'success');

    } catch (error) {
      console.error('Error al generar link:', error);
      showToast('Error al generar el link público', 'error');
    } finally {
      setGeneratingLink(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br pt-20 from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Mi Perfil</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona tus configuraciones de PC</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Información del Usuario */}
          <div className="lg:col-span-1 space-y-8">
            <ProfileCard title="Información Personal">
              {user && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nombre</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.nombre}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3">
                      <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Correo</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white break-words">{user.correo}</p>
                    </div>
                  </div>
                </div>
              )}
            </ProfileCard>

            {/* Evaluación con IA */}
            <ProfileCard title="🤖 Evaluación con IA">
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Selecciona un ensamble para obtener un análisis detallado con IA
                </p>
                
                {configurations.length > 0 ? (
                  <select
                    value={selectedEvaluationConfig?.id || ''}
                    onChange={(e) => {
                      const config = configurations.find(c => c.id === parseInt(e.target.value));
                      if (config) handleEvaluateWithAI(config);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecciona un ensamble...</option>
                    {configurations.map(config => (
                      <option key={config.id} value={config.id}>
                        {config.nombre} - ${config.totalPrice}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Crea un ensamble primero
                  </p>
                )}

                {evaluationLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">Analizando...</span>
                  </div>
                )}
              </div>
            </ProfileCard>
          </div>

          {/* Configuraciones Guardadas */}
          <div className="lg:col-span-3 space-y-6">
            <ProfileCard title="Mis Configuraciones">
              {error ? (
                <p className="text-red-500">{error}</p>
              ) : configurations.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {configurations.map((config, index) => (
                    <ConfigurationCard
                      key={config.id}
                      config={config}
                      index={index}
                      onDelete={handleDeleteEnsamble}
                      onEdit={handleEditEnsamble}
                      onShare={handleShareEnsamble}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    No tienes configuraciones guardadas.{' '}
                    <a href="/armar-pc" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                      ¡Crea tu primera configuración!
                    </a>
                  </p>
                </div>
              )}
            </ProfileCard>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedConfig.nombre} - Especificaciones Detalladas</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 modal-content-for-pdf">
              {/* Motherboard */}
              {selectedConfig.motherboardData && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    🖥️ Tarjeta Madre - {selectedConfig.motherboardData.nombre}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Socket:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.motherboardData.especificaciones?.['Socket / CPU'] || selectedConfig.motherboardData.especificaciones?.['Socket'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Chipset:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.motherboardData.especificaciones?.['Chipset'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Factor de Forma:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.motherboardData.especificaciones?.['Form Factor'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Ranuras RAM:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.motherboardData.especificaciones?.['Memory Slots'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Precio:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ${selectedConfig.motherboardData.precio}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* CPU */}
              {selectedConfig.cpuData && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    ⚡ Procesador - {selectedConfig.cpuData.nombre}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Núcleos:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.cpuData.especificaciones?.['Core Count'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Frecuencia:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.cpuData.especificaciones?.['Performance Core Clock'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">TDP:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.cpuData.especificaciones?.['TDP'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Precio:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ${selectedConfig.cpuData.precio}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* GPU */}
              {selectedConfig.gpuData && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    🎮 Tarjeta Gráfica - {selectedConfig.gpuData.nombre}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Memoria:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.gpuData.especificaciones?.['Memory'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Chipset:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.gpuData.especificaciones?.['Chipset'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Precio:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ${selectedConfig.gpuData.precio}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* RAM */}
              {selectedConfig.ramData && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    🧠 Memoria RAM - {selectedConfig.ramData.nombre}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Capacidad:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.ramData.especificaciones?.['Capacity'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Velocidad:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.ramData.especificaciones?.['Speed'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.ramData.especificaciones?.['Type'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Precio:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ${selectedConfig.ramData.precio}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Storage */}
              {selectedConfig.storageData && (
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    💾 Almacenamiento - {selectedConfig.storageData.nombre}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Capacidad:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.storageData.especificaciones?.['Capacity'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.storageData.especificaciones?.['Type'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Interfaz:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.storageData.especificaciones?.['Interface'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Precio:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ${selectedConfig.storageData.precio}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* PSU */}
              {selectedConfig.psuData && (
                <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    🔌 Fuente de Poder - {selectedConfig.psuData.nombre}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Potencia:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.psuData.especificaciones?.['Wattage'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Certificación:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.psuData.especificaciones?.['Efficiency Rating'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Precio:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ${selectedConfig.psuData.precio}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Case */}
              {selectedConfig.caseData && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    📦 Gabinete - {selectedConfig.caseData.nombre}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.caseData.especificaciones?.['Type'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Precio:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ${selectedConfig.caseData.precio}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Monitor */}
              {selectedConfig.monitorData && (
                <div className="bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    🖥️ Monitor - {selectedConfig.monitorData.nombre}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tamaño:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.monitorData.especificaciones?.['Screen Size'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Resolución:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.monitorData.especificaciones?.['Resolution'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tasa de Refresco:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedConfig.monitorData.especificaciones?.['Refresh Rate'] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Precio:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ${selectedConfig.monitorData.precio}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Evaluación de IA (si existe) */}
              {aiEvaluation && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        🤖 Evaluación de IA
                      </h2>
                      {aiEvaluation.puntuacion_general && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Puntuación:</span>
                          <div className="flex items-center">
                            {[...Array(10)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${
                                  i < aiEvaluation.puntuacion_general
                                    ? 'text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                              {aiEvaluation.puntuacion_general}/10
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Resumen */}
                    {aiEvaluation.resumen && (
                      <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📝 Resumen</h3>
                        <p className="text-gray-700 dark:text-gray-300">{aiEvaluation.resumen}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Puntos Fuertes */}
                      {aiEvaluation.puntos_fuertes && aiEvaluation.puntos_fuertes.length > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">✅ Puntos Fuertes</h3>
                          <ul className="space-y-1">
                            {aiEvaluation.puntos_fuertes.map((punto, idx) => (
                              <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span>{punto}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Puntos Débiles */}
                      {aiEvaluation.puntos_debiles && aiEvaluation.puntos_debiles.length > 0 && (
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-2">⚠️ Puntos Débiles</h3>
                          <ul className="space-y-1">
                            {aiEvaluation.puntos_debiles.map((punto, idx) => (
                              <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                <span className="text-orange-500 mt-1">•</span>
                                <span>{punto}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Compatibilidad */}
                    {aiEvaluation.compatibilidad && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                          🔧 Compatibilidad
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            aiEvaluation.compatibilidad.estado === 'EXCELENTE' ? 'bg-green-500 text-white' :
                            aiEvaluation.compatibilidad.estado === 'BUENA' ? 'bg-blue-500 text-white' :
                            aiEvaluation.compatibilidad.estado === 'ACEPTABLE' ? 'bg-yellow-500 text-white' :
                            'bg-red-500 text-white'
                          }`}>
                            {aiEvaluation.compatibilidad.estado}
                          </span>
                        </h3>
                        {aiEvaluation.compatibilidad.detalles && (
                          <ul className="space-y-1 mt-2">
                            {aiEvaluation.compatibilidad.detalles.map((detalle, idx) => (
                              <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{detalle}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {/* Conflictos */}
                    {aiEvaluation.conflictos && aiEvaluation.conflictos.length > 0 && (
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border-2 border-red-200 dark:border-red-700">
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">❌ Conflictos Detectados</h3>
                        <ul className="space-y-1">
                          {aiEvaluation.conflictos.map((conflicto, idx) => (
                            <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                              <span className="text-red-500 mt-1">•</span>
                              <span>{conflicto}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Uso Recomendado */}
                    {aiEvaluation.uso_recomendado && aiEvaluation.uso_recomendado.length > 0 && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-2">🎯 Uso Recomendado</h3>
                        <div className="flex flex-wrap gap-2">
                          {aiEvaluation.uso_recomendado.map((uso, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium"
                            >
                              {uso}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recomendaciones */}
                    {aiEvaluation.recomendaciones && aiEvaluation.recomendaciones.length > 0 && (
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300 mb-2">💡 Recomendaciones</h3>
                        <ul className="space-y-1">
                          {aiEvaluation.recomendaciones.map((rec, idx) => (
                            <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                              <span className="text-indigo-500 mt-1">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Balance y Precio-Valor en grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Balance */}
                      {aiEvaluation.balance && (
                        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-300 mb-3">⚖️ Balance</h3>
                          <div className="space-y-2">
                            {aiEvaluation.balance.cpu_gpu && (
                              <div className="text-sm">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">CPU-GPU: </span>
                                <span className="text-gray-600 dark:text-gray-400">{aiEvaluation.balance.cpu_gpu}</span>
                              </div>
                            )}
                            {aiEvaluation.balance.ram && (
                              <div className="text-sm">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">RAM: </span>
                                <span className="text-gray-600 dark:text-gray-400">{aiEvaluation.balance.ram}</span>
                              </div>
                            )}
                            {aiEvaluation.balance.almacenamiento && (
                              <div className="text-sm">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Almacenamiento: </span>
                                <span className="text-gray-600 dark:text-gray-400">{aiEvaluation.balance.almacenamiento}</span>
                              </div>
                            )}
                            {aiEvaluation.balance.fuente && (
                              <div className="text-sm">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Fuente: </span>
                                <span className="text-gray-600 dark:text-gray-400">{aiEvaluation.balance.fuente}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Precio-Valor */}
                      {aiEvaluation.precio_valor && (
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-2">💰 Precio-Calidad</h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{aiEvaluation.precio_valor}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-lg p-4 border-2 border-emerald-300 dark:border-emerald-700">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">💰 Total del Ensamble:</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    ${selectedConfig.totalPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 px-6 py-4 rounded-b-xl flex justify-between items-center gap-4 flex-wrap">
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => handleEvaluateWithAI(selectedConfig)}
                  disabled={evaluationLoading}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {evaluationLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Analizando...
                    </>
                  ) : (
                    <>
                      🤖 {aiEvaluation ? 'Re-evaluar' : 'Evaluar con IA'}
                    </>
                  )}
                </button>
                <button
                  onClick={handleGeneratePDF}
                  disabled={generatingPDF}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {generatingPDF ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generando...
                    </>
                  ) : (
                    <>
                      📄 Descargar PDF
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleGenerateShareLink(selectedConfig)}
                  disabled={generatingLink}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {generatingLink ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generando...
                    </>
                  ) : (
                    <>
                      🔗 Link Público
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleShareEnsamble(selectedConfig)}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                >
                  📋 Copiar Texto
                </button>
              </div>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setAiEvaluation(null);
                  setSelectedEvaluationConfig(null);
                }}
                className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
            toast.type === 'success'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
              : 'bg-gradient-to-r from-red-500 to-pink-600'
          }`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileWithAuth = () => {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
};

export default ProfileWithAuth; 