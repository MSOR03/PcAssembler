# ⚡ Quick Start - Evaluación de IA

## Paso 1: Obtener API Key (2 minutos)

1. Ve a: https://makersuite.google.com/app/apikey
2. Haz clic en **"Create API Key"**
3. Copia la key

## Paso 2: Configurar Backend (1 minuto)

Crea el archivo `Backend/.env`:

```env
DATABASE_URL="tu_database_url_aqui"
JWT_SECRET="tu_jwt_secret_aqui"
GEMINI_API_KEY="PEGA_TU_API_KEY_AQUI"
```

## Paso 3: Instalar y Ejecutar (2 minutos)

```bash
# Ya instalado, pero si necesitas reinstalar:
cd Backend
npm install

# Ejecutar backend
npm run dev
```

```bash
# En otra terminal
cd Frontend/my-app
npm run dev
```

## Paso 4: Usar la Funcionalidad (30 segundos)

1. Abre http://localhost:3000
2. Inicia sesión
3. Ve a **"Mi Perfil"**
4. En la sección **"🤖 Evaluación con IA"**
5. Selecciona un ensamble
6. ¡Listo! Verás el análisis completo

---

## ✅ ¿Funcionó?

Si ves la evaluación con:
- ⭐ Puntuación
- ✅ Puntos fuertes
- ⚠️ Puntos débiles
- 🔧 Compatibilidad

**¡Todo está perfecto!**

---

## ❌ ¿No funciona?

### Error: "Invalid API Key"
→ Verifica que copiaste la API key completa en `.env`
→ Reinicia el servidor backend

### Error: "Ensamble no encontrado"
→ Crea un ensamble primero en "Armar PC"

### No aparece nada
→ Abre consola (F12) y busca errores rojos
→ Verifica que ambos servidores estén corriendo

---

## 📖 Documentación Completa

Ver: `AI_EVALUATION_GUIDE.md` para guía completa

---

## 🎉 ¡Listo para Producir!

**Características implementadas:**
- ✅ Backend con Gemini AI
- ✅ Frontend con UI completa
- ✅ Análisis de compatibilidad
- ✅ Recomendaciones personalizadas
- ✅ Detección de conflictos
- ✅ Balance de componentes
- ✅ Relación precio-calidad
- ✅ 100% gratis (15 req/min)
