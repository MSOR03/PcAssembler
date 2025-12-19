'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SharedEnsamblePage() {
  const params = useParams();
  const token = params?.token;
  
  const [ensambleData, setEnsambleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedEnsamble = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/shared/${token}`);
        setEnsambleData(response.data);
      } catch (err) {
        console.error('Error al cargar ensamble:', err);
        setError(err.response?.data?.error || 'Error al cargar el ensamble');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSharedEnsamble();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando ensamble...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 max-w-md">
          <h2 className="text-white text-xl font-bold mb-2">Error</h2>
          <p className="text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  if (!ensambleData) {
    return null;
  }

  const getComponentsByType = (type) => {
    return ensambleData.Ensamble_Componente
      .filter((ec) => ec.Componente.tipo === type)
      .map((ec) => ec.Componente);
  };

  const motherboard = getComponentsByType('Motherboard')[0];
  const cpu = getComponentsByType('CPU')[0];
  const gpu = getComponentsByType('Video Card')[0];
  const ram = getComponentsByType('Memory');
  const storage = getComponentsByType('Storage');
  const psu = getComponentsByType('Power Supply')[0];
  const caseComponent = getComponentsByType('Case')[0];
  const monitor = getComponentsByType('Monitor')[0];

  const aiEvaluation = ensambleData.EvaluacionIA;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{ensambleData.nombre}</h1>
          <p className="text-blue-100">
            Compartido por <span className="font-semibold">{ensambleData.Usuario.nombre}</span>
          </p>
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-b-2xl p-8 shadow-2xl">
          <div className="space-y-6">
            {/* Components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Motherboard */}
              {motherboard && (
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <h3 className="text-lg font-bold text-blue-400 mb-3">🔌 Motherboard</h3>
                  <p className="text-white font-semibold mb-2">{motherboard.nombre}</p>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p><span className="text-gray-400">Socket:</span> {motherboard.especificaciones?.['Socket / CPU'] || motherboard.especificaciones?.['Socket'] || '—'}</p>
                    <p><span className="text-gray-400">Chipset:</span> {motherboard.especificaciones?.['Chipset'] || '—'}</p>
                    <p><span className="text-gray-400">Slots RAM:</span> {motherboard.especificaciones?.['Memory Slots'] || '—'}</p>
                    <p className="text-green-400 font-bold mt-2">${Math.round(motherboard.precio)}</p>
                  </div>
                </div>
              )}

              {/* CPU */}
              {cpu && (
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <h3 className="text-lg font-bold text-purple-400 mb-3">⚡ Procesador</h3>
                  <p className="text-white font-semibold mb-2">{cpu.nombre}</p>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p><span className="text-gray-400">Núcleos:</span> {cpu.especificaciones?.['Core Count'] || '—'}</p>
                    <p><span className="text-gray-400">Frecuencia:</span> {cpu.especificaciones?.['Performance Core Clock'] || cpu.especificaciones?.['Performance Core Boost Clock'] || '—'}</p>
                    <p><span className="text-gray-400">TDP:</span> {cpu.especificaciones?.['TDP'] || '—'}</p>
                    <p className="text-green-400 font-bold mt-2">${Math.round(cpu.precio)}</p>
                  </div>
                </div>
              )}

              {/* GPU */}
              {gpu && (
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <h3 className="text-lg font-bold text-red-400 mb-3">🎮 Tarjeta Gráfica</h3>
                  <p className="text-white font-semibold mb-2">{gpu.nombre}</p>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p><span className="text-gray-400">VRAM:</span> {gpu.especificaciones?.['Memory'] || '—'}</p>
                    <p><span className="text-gray-400">TDP:</span> {gpu.especificaciones?.['TDP'] || '—'}</p>
                    <p className="text-green-400 font-bold mt-2">${Math.round(gpu.precio)}</p>
                  </div>
                </div>
              )}

              {/* RAM */}
              {ram.length > 0 && (
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <h3 className="text-lg font-bold text-green-400 mb-3">💾 Memoria RAM</h3>
                  {ram.map((r, idx) => (
                    <div key={idx} className="mb-3 last:mb-0">
                      <p className="text-white font-semibold mb-1">{r.nombre}</p>
                      <div className="space-y-1 text-sm text-gray-300">
                        <p><span className="text-gray-400">Capacidad:</span> {r.especificaciones?.['Modules'] || '—'}</p>
                        <p><span className="text-gray-400">Velocidad:</span> {r.especificaciones?.['Speed'] || '—'}</p>
                        <p className="text-green-400 font-bold">${Math.round(r.precio)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Storage */}
              {storage.length > 0 && (
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <h3 className="text-lg font-bold text-yellow-400 mb-3">💿 Almacenamiento</h3>
                  {storage.map((s, idx) => (
                    <div key={idx} className="mb-3 last:mb-0">
                      <p className="text-white font-semibold mb-1">{s.nombre}</p>
                      <div className="space-y-1 text-sm text-gray-300">
                        <p><span className="text-gray-400">Capacidad:</span> {s.especificaciones?.['Capacity'] || '—'}</p>
                        <p><span className="text-gray-400">Tipo:</span> {s.especificaciones?.['Type'] || '—'}</p>
                        <p className="text-green-400 font-bold">${Math.round(s.precio)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PSU */}
              {psu && (
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <h3 className="text-lg font-bold text-orange-400 mb-3">🔋 Fuente de Poder</h3>
                  <p className="text-white font-semibold mb-2">{psu.nombre}</p>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p><span className="text-gray-400">Potencia:</span> {psu.especificaciones?.['Wattage'] || '—'}</p>
                    <p><span className="text-gray-400">Certificación:</span> {psu.especificaciones?.['Efficiency Rating'] || '—'}</p>
                    <p className="text-green-400 font-bold mt-2">${Math.round(psu.precio)}</p>
                  </div>
                </div>
              )}

              {/* Case */}
              {caseComponent && (
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">🏠 Case</h3>
                  <p className="text-white font-semibold mb-2">{caseComponent.nombre}</p>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p><span className="text-gray-400">Factor:</span> {caseComponent.especificaciones?.['Type'] || '—'}</p>
                    <p className="text-green-400 font-bold mt-2">${Math.round(caseComponent.precio)}</p>
                  </div>
                </div>
              )}

              {/* Monitor */}
              {monitor && (
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <h3 className="text-lg font-bold text-pink-400 mb-3">🖥️ Monitor</h3>
                  <p className="text-white font-semibold mb-2">{monitor.nombre}</p>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p><span className="text-gray-400">Tamaño:</span> {monitor.especificaciones?.['Screen Size'] || '—'}</p>
                    <p><span className="text-gray-400">Resolución:</span> {monitor.especificaciones?.['Resolution'] || '—'}</p>
                    <p><span className="text-gray-400">Tasa:</span> {monitor.especificaciones?.['Refresh Rate'] || '—'}</p>
                    <p className="text-green-400 font-bold mt-2">${Math.round(monitor.precio)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* AI Evaluation */}
            {aiEvaluation && (
              <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-lg p-6 border-2 border-purple-500/50 mt-6">
                <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                  🤖 Evaluación IA
                </h2>

                {/* Score */}
                <div className="bg-purple-800/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-200 font-semibold">Puntuación General:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-yellow-400">
                        {aiEvaluation.puntuacion_general}/10
                      </span>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={i < Math.round(aiEvaluation.puntuacion_general / 2) ? 'text-yellow-400' : 'text-gray-600'}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                {aiEvaluation.resumen && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">📝 Resumen</h3>
                    <p className="text-gray-300">{aiEvaluation.resumen}</p>
                  </div>
                )}

                {/* Strengths and Weaknesses */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {aiEvaluation.puntos_fuertes && aiEvaluation.puntos_fuertes.length > 0 && (
                    <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                      <h3 className="text-lg font-semibold text-green-400 mb-2">✅ Puntos Fuertes</h3>
                      <ul className="space-y-1">
                        {aiEvaluation.puntos_fuertes.map((punto, idx) => (
                          <li key={idx} className="text-gray-300 text-sm">• {punto}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiEvaluation.puntos_debiles && aiEvaluation.puntos_debiles.length > 0 && (
                    <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-500/30">
                      <h3 className="text-lg font-semibold text-orange-400 mb-2">⚠️ Puntos Débiles</h3>
                      <ul className="space-y-1">
                        {aiEvaluation.puntos_debiles.map((punto, idx) => (
                          <li key={idx} className="text-gray-300 text-sm">• {punto}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Recommended Use */}
                {aiEvaluation.uso_recomendado && aiEvaluation.uso_recomendado.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">🎯 Uso Recomendado</h3>
                    <div className="flex flex-wrap gap-2">
                      {aiEvaluation.uso_recomendado.map((uso, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-600/30 border border-purple-400/50 text-purple-200 px-3 py-1 rounded-full text-sm"
                        >
                          {uso}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {aiEvaluation.recomendaciones && aiEvaluation.recomendaciones.length > 0 && (
                  <div className="bg-indigo-900/20 rounded-lg p-4 border border-indigo-500/30">
                    <h3 className="text-lg font-semibold text-indigo-400 mb-2">💡 Recomendaciones</h3>
                    <ul className="space-y-1">
                      {aiEvaluation.recomendaciones.map((rec, idx) => (
                        <li key={idx} className="text-gray-300 text-sm">• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Total Price */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">Costo Total</span>
                <span className="text-4xl font-bold">${Math.round(ensambleData.costo_total)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-6 border-t border-gray-700">
              <p className="text-gray-400">
                Creado con <span className="text-purple-400 font-bold">PC Assembler</span> 🚀
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
