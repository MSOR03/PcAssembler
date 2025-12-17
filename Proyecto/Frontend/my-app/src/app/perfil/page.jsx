'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import axios from 'axios';

const ProfileCard = ({ title, children }) => (
  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6">
    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
      {title}
    </h2>
    {children}
  </div>
);

const ConfigurationCard = ({ config, index, onDelete, onEdit, onShare }) => (
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
    <div className="flex gap-2 mb-4">
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
          motherboard: ensamble.componentes['Motherboard'] || 'No seleccionado',
          cpu: ensamble.componentes['CPU'] || 'No seleccionado',
          gpu: ensamble.componentes['Video Card'] || 'No seleccionado',
          ram: ensamble.componentes['Memory'] || 'No seleccionado',
          storage: ensamble.componentes['Storage'] || 'No seleccionado',
          psu: ensamble.componentes['Power Supply'] || 'No seleccionado',
          case: ensamble.componentes['Case'] || 'No seleccionado',
          monitor: ensamble.componentes['Monitor'] || 'No seleccionado'
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
    // Aquí iría la lógica para editar el ensamble
    // Por ahora, solo mostramos un mensaje
    alert(`Funcionalidad de edición próximamente disponible para "${config.nombre}"`);
  };

  const handleShareEnsamble = (config) => {
    // Lógica para compartir el ensamble
    const shareText = `¡Mira mi configuración de PC "${config.nombre}"!\n\n` +
      `💰 Precio total: $${config.totalPrice}\n` +
      `🖥️ Motherboard: ${config.motherboard}\n` +
      `⚡ CPU: ${config.cpu}\n` +
      `🎮 GPU: ${config.gpu}\n` +
      `🧠 RAM: ${config.ram}\n` +
      `💾 Almacenamiento: ${config.storage}\n` +
      `🔌 PSU: ${config.psu}\n` +
      `📦 Case: ${config.case}\n` +
      `🖥️ Monitor: ${config.monitor}`;

    navigator.clipboard.writeText(shareText).then(() => {
      showToast('Configuración copiada al portapapeles', 'success');
    }).catch(() => {
      showToast('No se pudo copiar al portapapeles', 'error');
    });
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
          <div className="lg:col-span-1">
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
          </div>

          {/* Configuraciones Guardadas */}
          <div className="lg:col-span-3">
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