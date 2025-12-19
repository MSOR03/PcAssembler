# 🤖 Guía de Configuración de Evaluación con IA

## Descripción
Esta funcionalidad permite evaluar ensambles de PC usando **Google Gemini 1.5 Flash** (modelo gratuito de IA). Proporciona análisis detallado de compatibilidad, balance de componentes, puntos fuertes/débiles, recomendaciones y más.

---

## 📋 Requisitos

### 1. Obtener API Key de Google Gemini (GRATIS)

1. Visita: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key"
4. Copia la API key generada

**Límites gratuitos:**
- ✅ **15 solicitudes por minuto**
- ✅ **1,500 solicitudes por día**
- ✅ **1 millón de tokens por mes**
- ✅ Sin costo ($0/mes)

### 2. Configurar Backend

#### Opción A: Archivo .env (Recomendado)

1. Crea un archivo `.env` en la carpeta `Backend/`:

```bash
# Backend/.env

# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/pcbuilder?schema=public"

# JWT Secret
JWT_SECRET="tu_secret_key_aqui"

# Gemini API Key
GEMINI_API_KEY="TU_API_KEY_AQUI_DE_GOOGLE"

# Cloudinary (opcional)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

2. Reemplaza `TU_API_KEY_AQUI_DE_GOOGLE` con tu API key de Gemini

#### Opción B: Directamente en el código (No recomendado para producción)

Edita `Backend/src/controllers/aiEvaluationController.js` línea 7:

```javascript
const genAI = new GoogleGenerativeAI('TU_API_KEY_AQUI');
```

---

## 🚀 Uso de la Funcionalidad

### Desde el Frontend (Perfil)

1. Inicia sesión en tu cuenta
2. Ve a **"Mi Perfil"**
3. En la sección **"🤖 Evaluación con IA"** (debajo de Información Personal)
4. Selecciona un ensamble del dropdown
5. La evaluación se ejecutará automáticamente
6. Verás el análisis completo con:
   - **Puntuación General** (1-10 estrellas)
   - **Resumen** del ensamble
   - **Puntos Fuertes** ✅
   - **Puntos Débiles** ⚠️
   - **Compatibilidad** 🔧 (EXCELENTE/BUENA/ACEPTABLE/PROBLEMÁTICA)
   - **Conflictos Detectados** ❌
   - **Uso Recomendado** 🎯 (Gaming, Edición, etc.)
   - **Recomendaciones** 💡
   - **Balance de Componentes** ⚖️
   - **Relación Precio-Calidad** 💰

### Desde la API (Postman/Programáticamente)

**Endpoint:** `POST http://localhost:3001/api/evaluar-ensamble`

**Headers:**
```
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json
```

**Body:**
```json
{
  "ensambleId": 1
}
```

**Respuesta:**
```json
{
  "success": true,
  "ensamble": {
    "id": 1,
    "nombre": "Gaming Beast",
    "precio_total": 1500
  },
  "evaluacion": {
    "puntuacion_general": 9,
    "resumen": "Excelente ensamble para gaming...",
    "puntos_fuertes": ["..."],
    "puntos_debiles": ["..."],
    "compatibilidad": {
      "estado": "EXCELENTE",
      "detalles": ["..."]
    },
    "balance": {
      "cpu_gpu": "Perfecto balance...",
      "ram": "16GB suficiente para gaming...",
      "almacenamiento": "SSD rápido...",
      "fuente": "Wattaje adecuado..."
    },
    "uso_recomendado": ["Gaming", "Streaming"],
    "recomendaciones": ["..."],
    "conflictos": [],
    "precio_valor": "Excelente relación precio-calidad..."
  }
}
```

---

## 🛠️ Estructura de Archivos Creados

### Backend

```
Backend/
├── src/
│   ├── controllers/
│   │   └── aiEvaluationController.js  ← Controller de IA (nuevo)
│   └── routes/
│       └── aiEvaluationRoutes.js      ← Rutas de IA (nuevo)
├── .env.example                        ← Ejemplo de configuración
└── package.json                        ← Incluye @google/generative-ai
```

### Frontend

```
Frontend/my-app/src/app/
└── perfil/
    └── page.jsx                        ← Actualizado con sección de IA
```

---

## 🔍 Detalles Técnicos

### Análisis que Realiza la IA

1. **Compatibilidad de Socket:** Verifica CPU-Motherboard
2. **Wattaje de Fuente:** Calcula si es suficiente para todos los componentes
3. **Cuello de Botella:** Analiza balance CPU-GPU
4. **Memoria RAM:** Evalúa capacidad según uso (16GB gaming, 32GB edición)
5. **Almacenamiento:** Tipo (SSD/HDD) y capacidad
6. **Balance General:** Todos los componentes proporcionados

### Modelo de IA Usado

- **Modelo:** `gemini-1.5-flash`
- **Proveedor:** Google
- **Costo:** Gratis
- **Velocidad:** ~2-3 segundos por evaluación
- **Calidad:** Alta precisión en análisis de hardware

---

## ⚠️ Solución de Problemas

### Error: "Invalid API Key"

**Problema:** La API key no es válida o no está configurada.

**Solución:**
1. Verifica que copiaste la API key completa
2. Asegúrate de no tener espacios adicionales
3. Revisa que el archivo `.env` esté en `Backend/` (no en subdirectorios)
4. Reinicia el servidor backend después de agregar la key

### Error: "Resource has been exhausted"

**Problema:** Superaste el límite de 15 solicitudes/minuto.

**Solución:**
- Espera 1 minuto
- Implementa caché para evitar re-evaluar el mismo ensamble

### Error: "Failed to parse AI response"

**Problema:** Gemini no devolvió JSON válido.

**Solución:**
- La evaluación se mostrará en formato de texto plano (campo `raw_response`)
- Esto es un fallback automático
- Usualmente funciona bien, pero si persiste, contacta soporte

### No aparece la evaluación

**Problema:** No se muestra nada después de seleccionar ensamble.

**Solución:**
1. Abre la consola del navegador (F12) y busca errores
2. Verifica que el backend esté corriendo (`npm run dev` en Backend/)
3. Verifica que tengas ensambles guardados
4. Revisa que estés autenticado correctamente

---

## 📊 Ejemplo de Evaluación

**Entrada:**
- CPU: Intel Core i5-13600K
- GPU: NVIDIA RTX 4070
- RAM: 16GB DDR4-3200
- Motherboard: MSI Z790
- PSU: 650W 80+ Gold
- Storage: 1TB NVMe SSD

**Salida:**
```
Puntuación: 9/10

✅ Puntos Fuertes:
- Excelente balance CPU-GPU
- RAM suficiente para gaming AAA
- SSD rápido para tiempos de carga
- Fuente con buena eficiencia

⚠️ Puntos Débiles:
- Podría beneficiarse de 32GB RAM para edición pesada
- 1TB puede llenarse rápido con juegos modernos

🔧 Compatibilidad: EXCELENTE
- Socket LGA1700 compatible
- RAM DDR4 soportada
- Fuente adecuada para el consumo (~450W)

🎯 Uso Recomendado: Gaming, Streaming, Edición Casual

💡 Recomendaciones:
- Considerar 2TB de almacenamiento
- Agregar ventiladores adicionales
```

---

## 🎨 Características UI

### Diseño Visual

- **Gradientes:** Fondo púrpura-azul
- **Cards Coloridas:** Verde (puntos fuertes), Naranja (débiles), Rojo (conflictos)
- **Estrellas Animadas:** Puntuación visual 1-10
- **Responsive:** Se adapta a móvil, tablet y desktop
- **Dark Mode:** Soporte completo para modo oscuro

### Interacción

- **Dropdown:** Selección simple de ensambles
- **Loading:** Spinner mientras se evalúa
- **Toast:** Notificaciones de éxito/error
- **Botón Cerrar:** X para ocultar evaluación
- **Auto-scroll:** Se muestra arriba para fácil lectura

---

## 🔐 Seguridad

- ✅ **Autenticación JWT:** Solo usuarios autenticados
- ✅ **Validación:** Solo ensambles propios del usuario
- ✅ **Rate Limiting:** Gemini limita a 15 req/min
- ✅ **Variables de Entorno:** API keys no en código fuente
- ✅ **CORS:** Configurado correctamente

---

## 🚀 Próximas Mejoras Opcionales

1. **Caché de Evaluaciones:** Guardar en BD para evitar re-evaluar
2. **Historial:** Ver evaluaciones anteriores
3. **Comparación:** Comparar 2 ensambles lado a lado
4. **Export PDF:** Descargar evaluación como PDF
5. **Compartir:** Enlace público a evaluación

---

## 📞 Soporte

Si tienes problemas:
1. Revisa esta guía completa
2. Busca errores en consola (F12)
3. Verifica logs del backend
4. Asegúrate de tener API key válida

**Recursos:**
- [Documentación Gemini](https://ai.google.dev/docs)
- [Obtener API Key](https://makersuite.google.com/app/apikey)
- [Límites y Cuotas](https://ai.google.dev/pricing)
