import { useState, useEffect } from 'react';

export const useCompatibleMonitors = (gpuId) => {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompatibleMonitors = async () => {
    console.log("🎯 Hook useCompatibleMonitors llamado con gpuId:", gpuId);

    if (!gpuId) {
      console.log("⚠️ gpuId es null/undefined, no se hace petición");
      setMonitors([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("📡 Enviando petición a /api/get-compatible-monitors con gpuId:", gpuId);

      const response = await fetch('http://localhost:3001/api/get-compatible-monitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gpuId: gpuId.toString() // Asegurar que sea string
        }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener monitores compatibles');
      }

      const data = await response.json();

      // La función devuelve directamente el array de monitores compatibles
      if (Array.isArray(data)) {
        setMonitors(data);
      } else {
        console.error('Formato de respuesta inesperado:', data);
        setMonitors([]);
      }
    } catch (err) {
      setError(err.message);
      setMonitors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompatibleMonitors();
  }, [gpuId]);

  const refetch = () => {
    fetchCompatibleMonitors();
  };

  return {
    monitors,
    loading,
    error,
    refetch
  };
}; 