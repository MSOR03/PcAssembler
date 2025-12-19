/* eslint-disable no-undef */
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listarModelos() {
  try {
    console.log('🔍 Buscando modelos disponibles...\n');
    
    // Intentar listar modelos
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY);
    const data = await response.json();
    
    if (data.models) {
      console.log('✅ Modelos disponibles:');
      data.models.forEach(model => {
        console.log(`   - ${model.name}`);
        if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes('generateContent')) {
          console.log('     ✓ Soporta generateContent');
        }
      });
    } else {
      console.log('❌ No se pudieron obtener modelos');
      console.log('Respuesta:', data);
    }
  } catch (error) {
    console.error('❌ Error al listar modelos:', error.message);
  }
}

listarModelos();
