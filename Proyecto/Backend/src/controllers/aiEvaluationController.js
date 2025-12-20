/* eslint-disable no-undef */
import { GoogleGenerativeAI } from '@google/generative-ai';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/prismaClient.js';

// Inicializar Gemini con tu API key
// NOTA: Obtén tu API key gratis en https://makersuite.google.com/app/apikey
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyD_YOUR_API_KEY_HERE');

/**
 * Evalúa un ensamble de PC usando IA
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const evaluarEnsamble = async (req, res) => {
  try {
    // 1️⃣ Obtener y verificar el token del usuario
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: "No autorizado" });
    }

    // 2️⃣ Decodificar el token para obtener el ID del usuario
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!userId) {
      return res.status(400).json({ error: "Error: El ID de usuario no se encontró en el token" });
    }

    const { ensambleId } = req.body;

    if (!ensambleId) {
      return res.status(400).json({ error: 'Se requiere el ID del ensamble' });
    }

    // Obtener el ensamble con todos sus componentes
    const ensamble = await prisma.ensamble.findFirst({
      where: {
        id_ensamble: parseInt(ensambleId),
        id_usuario: userId
      },
      include: {
        Ensamble_Componente: {
          include: {
            Componente: true
          }
        }
      }
    });

    if (!ensamble) {
      return res.status(404).json({ error: 'Ensamble no encontrado' });
    }

    // Transformar los componentes a un formato legible
    const componentes = {};
    ensamble.Ensamble_Componente.forEach(ec => {
      const categoria = ec.Componente.categoria;
      componentes[categoria] = {
        nombre: ec.Componente.nombre,
        marca: ec.Componente.marca,
        precio: ec.Componente.precio,
        especificaciones: typeof ec.Componente.especificaciones === 'string'
          ? JSON.parse(ec.Componente.especificaciones)
          : ec.Componente.especificaciones
      };
    });

    // Construir el prompt para Gemini
    const prompt = `Eres un experto en hardware de PCs. Evalúa el siguiente ensamble de PC y proporciona un análisis detallado en formato JSON con la siguiente estructura:

{
  "puntuacion_general": <número del 1-10>,
  "resumen": "<breve resumen de 2-3 líneas>",
  "puntos_fuertes": ["<punto 1>", "<punto 2>", ...],
  "puntos_debiles": ["<punto 1>", "<punto 2>", ...],
  "compatibilidad": {
    "estado": "<EXCELENTE|BUENA|ACEPTABLE|PROBLEMATICA>",
    "detalles": ["<detalle 1>", "<detalle 2>", ...]
  },
  "balance": {
    "cpu_gpu": "<análisis del balance entre CPU y GPU>",
    "ram": "<análisis de la RAM>",
    "almacenamiento": "<análisis del almacenamiento>",
    "fuente": "<análisis de la fuente de poder>"
  },
  "uso_recomendado": ["<Gaming>", "<Edición de Video>", "<Programación>", etc],
  "recomendaciones": ["<recomendación 1>", "<recomendación 2>", ...],
  "conflictos": ["<conflicto 1 si existe>", ...],
  "precio_valor": "<análisis de relación precio-calidad>"
}

ENSAMBLE A EVALUAR:
Nombre: ${ensamble.nombre_ensamble}
Precio Total: $${ensamble.costo_total}

COMPONENTES:
${JSON.stringify(componentes, null, 2)}

IMPORTANTE: 
- Verifica compatibilidad de socket CPU-Motherboard
- Verifica que la fuente tenga suficiente wattaje
- Analiza si hay cuello de botella entre CPU y GPU
- Considera el uso de RAM (gaming necesita 16GB+, edición 32GB+)
- Evalúa si el almacenamiento es adecuado
- Responde SOLO con el JSON, sin texto adicional`;

    // Llamar a Gemini
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash'
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Intentar parsear la respuesta como JSON
    let evaluacion;
    try {
      // Limpiar el texto de posibles marcadores de código
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      evaluacion = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Error al parsear respuesta de IA:', parseError);
      console.log('Respuesta recibida:', text);
      
      // Si falla el parseo, devolver la respuesta como texto plano
      evaluacion = {
        puntuacion_general: 7,
        resumen: text.substring(0, 200),
        raw_response: text
      };
    }

    // Guardar la evaluación en la base de datos
    try {
      await prisma.evaluacionIA.upsert({
        where: { id_ensamble: ensamble.id_ensamble },
        update: {
          puntuacion_general: evaluacion.puntuacion_general || null,
          resumen: evaluacion.resumen || null,
          puntos_fuertes: evaluacion.puntos_fuertes || null,
          puntos_debiles: evaluacion.puntos_debiles || null,
          compatibilidad: evaluacion.compatibilidad || null,
          balance: evaluacion.balance || null,
          uso_recomendado: evaluacion.uso_recomendado || null,
          recomendaciones: evaluacion.recomendaciones || null,
          conflictos: evaluacion.conflictos || null,
          precio_valor: evaluacion.precio_valor || null,
          fecha_evaluacion: new Date()
        },
        create: {
          id_ensamble: ensamble.id_ensamble,
          puntuacion_general: evaluacion.puntuacion_general || null,
          resumen: evaluacion.resumen || null,
          puntos_fuertes: evaluacion.puntos_fuertes || null,
          puntos_debiles: evaluacion.puntos_debiles || null,
          compatibilidad: evaluacion.compatibilidad || null,
          balance: evaluacion.balance || null,
          uso_recomendado: evaluacion.uso_recomendado || null,
          recomendaciones: evaluacion.recomendaciones || null,
          conflictos: evaluacion.conflictos || null,
          precio_valor: evaluacion.precio_valor || null
        }
      });
    } catch (dbError) {
      console.error('Error al guardar evaluación en BD:', dbError);
      // Continuar aunque falle el guardado
    }

    res.status(200).json({
      success: true,
      ensamble: {
        id: ensamble.id_ensamble,
        nombre: ensamble.nombre_ensamble,
        precio_total: ensamble.costo_total
      },
      evaluacion
    });

  } catch (error) {
    console.error('Error al evaluar ensamble:', error);
    res.status(500).json({
      error: 'Error al evaluar el ensamble',
      details: error.message
    });
  }
};

/**
 * Obtiene el historial de evaluaciones de un usuario
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const obtenerHistorialEvaluaciones = async (req, res) => {
  try {
    // Por ahora devolvemos un array vacío
    // Puedes implementar almacenamiento de evaluaciones en BD si lo deseas
    res.status(200).json({
      success: true,
      evaluaciones: []
    });

  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({
      error: 'Error al obtener el historial de evaluaciones'
    });
  }
};

/**
 * Obtiene la evaluación guardada de un ensamble
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const obtenerEvaluacionEnsamble = async (req, res) => {
  try {
    const { ensambleId } = req.params;
    
    const evaluacion = await prisma.evaluacionIA.findUnique({
      where: { id_ensamble: parseInt(ensambleId) },
      include: {
        Ensamble: {
          select: {
            nombre: true,
            costo_total: true,
            fecha_modificacion: true
          }
        }
      }
    });

    if (!evaluacion) {
      return res.status(404).json({ 
        success: false,
        message: 'No hay evaluación guardada para este ensamble' 
      });
    }

    res.status(200).json({
      success: true,
      evaluacion: {
        puntuacion_general: evaluacion.puntuacion_general,
        resumen: evaluacion.resumen,
        puntos_fuertes: evaluacion.puntos_fuertes,
        puntos_debiles: evaluacion.puntos_debiles,
        compatibilidad: evaluacion.compatibilidad,
        balance: evaluacion.balance,
        uso_recomendado: evaluacion.uso_recomendado,
        recomendaciones: evaluacion.recomendaciones,
        conflictos: evaluacion.conflictos,
        precio_valor: evaluacion.precio_valor,
        fecha_evaluacion: evaluacion.fecha_evaluacion
      },
      ensamble: evaluacion.Ensamble
    });

  } catch (error) {
    console.error('Error al obtener evaluación:', error);
    res.status(500).json({
      error: 'Error al obtener la evaluación'
    });
  }
};

/**
 * Evalúa componente paso a paso (SIN IA - solo lógica)
 */
export const evaluarComponentePasoAPaso = async (req, res) => {
  try {
    const { analyzeCPU, analyzeGPU, analyzeRAM, analyzeStorage, analyzePSU, detectBottleneck } = 
      await import('../services/performanceAnalyzer.js');

    const { componentType, componentId, currentComponents } = req.body;

    if (!componentType || !componentId) {
      return res.status(400).json({ error: 'Tipo y ID de componente requeridos' });
    }

    const component = await prisma.componente.findUnique({
      where: { id_componente: parseInt(componentId) }
    });

    if (!component) {
      return res.status(404).json({ error: 'Componente no encontrado' });
    }

    let analysis = {};

    switch (componentType.toLowerCase()) {
      case 'cpu':
        analysis = analyzeCPU(component);
        break;
      
      case 'video card':
      case 'gpu':
        analysis = analyzeGPU(component);
        // Si hay CPU, verificar bottleneck
        if (currentComponents?.cpu) {
          const cpuComp = await prisma.componente.findUnique({
            where: { id_componente: parseInt(currentComponents.cpu) }
          });
          if (cpuComp) {
            const cpuAnalysis = analyzeCPU(cpuComp);
            analysis.bottleneckCheck = detectBottleneck(cpuAnalysis, analysis);
          }
        }
        break;
      
      case 'memory':
      case 'ram':
        analysis = analyzeRAM(component);
        break;
      
      case 'storage':
        analysis = analyzeStorage(component);
        break;
      
      case 'power supply':
      case 'psu':
        let cpuAnalysis = null;
        let gpuAnalysis = null;
        
        if (currentComponents?.cpu) {
          const cpuComp = await prisma.componente.findUnique({
            where: { id_componente: parseInt(currentComponents.cpu) }
          });
          if (cpuComp) cpuAnalysis = analyzeCPU(cpuComp);
        }
        
        if (currentComponents?.gpu) {
          const gpuComp = await prisma.componente.findUnique({
            where: { id_componente: parseInt(currentComponents.gpu) }
          });
          if (gpuComp) gpuAnalysis = analyzeGPU(gpuComp);
        }
        
        analysis = analyzePSU(component, cpuAnalysis, gpuAnalysis);
        break;
      
      default:
        analysis = { score: 70, tier: 'B', status: 'bueno', message: '✅ Componente Compatible' };
    }

    res.status(200).json({
      success: true,
      component: {
        id: component.id_componente,
        nombre: component.nombre,
        categoria: component.categoria,
        precio: component.precio
      },
      analysis
    });

  } catch (error) {
    console.error('Error al evaluar componente:', error);
    res.status(500).json({ error: 'Error al evaluar componente' });
  }
};

/**
 * Análisis completo del ensamble (SIN IA - solo lógica)
 */
export const analizarEnsambleCompleto = async (req, res) => {
  try {
    const { analyzeCompleteSystem } = await import('../services/performanceAnalyzer.js');
    const { componentIds } = req.body;

    if (!componentIds || Object.keys(componentIds).length === 0) {
      return res.status(400).json({ error: 'IDs de componentes requeridos' });
    }

    const components = {};
    
    if (componentIds.cpu) {
      components.cpu = await prisma.componente.findUnique({
        where: { id_componente: parseInt(componentIds.cpu) }
      });
    }
    
    if (componentIds.gpu) {
      components.gpu = await prisma.componente.findUnique({
        where: { id_componente: parseInt(componentIds.gpu) }
      });
    }
    
    if (componentIds.ram) {
      components.ram = await prisma.componente.findUnique({
        where: { id_componente: parseInt(componentIds.ram) }
      });
    }
    
    if (componentIds.storage) {
      components.storage = await prisma.componente.findUnique({
        where: { id_componente: parseInt(componentIds.storage) }
      });
    }
    
    if (componentIds.psu) {
      components.psu = await prisma.componente.findUnique({
        where: { id_componente: parseInt(componentIds.psu) }
      });
    }

    const analysis = analyzeCompleteSystem(components);

    res.status(200).json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Error al analizar ensamble:', error);
    res.status(500).json({ error: 'Error al analizar ensamble' });
  }
};
