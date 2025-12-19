# Guía de Compartir Ensambles - PC Assembler

## 📤 Funcionalidad de Compartir

La aplicación PC Assembler ofrece múltiples formas de compartir tus configuraciones de PC con otros:

### 1. 📄 Descargar PDF

Genera un documento PDF profesional con todos los detalles de tu ensamble:

**Características:**
- Diseño de alta calidad con todos los componentes
- Incluye la evaluación IA si está disponible
- Formato A4 listo para imprimir
- Múltiples páginas si es necesario

**Cómo usar:**
1. Abre el modal de detalles de tu ensamble
2. Haz clic en el botón "📄 Descargar PDF"
3. El archivo se descargará automáticamente con el nombre de tu ensamble

---

### 2. 🔗 Link Público

Comparte tu ensamble con un link único y seguro:

**Características:**
- Link único e irrastreable
- No requiere que el visitante tenga cuenta
- Muestra todos los componentes y evaluación IA
- Diseño profesional igual al de la aplicación
- El creador puede desactivar el link cuando quiera

**Cómo usar:**
1. Abre el modal de detalles de tu ensamble
2. Haz clic en el botón "🔗 Link Público"
3. El link se generará y se copiará automáticamente al portapapeles
4. Comparte el link con quien quieras

**Formato del link:**
```
http://localhost:3002/shared/[token-único]
```

**Seguridad:**
- Solo ensambles marcados como públicos son accesibles
- El token es aleatorio y único de 32 caracteres
- El dueño puede desactivar el compartir en cualquier momento

---

### 3. 📋 Copiar Texto

Copia una versión de texto plano con formato bonito:

**Características:**
- Texto formateado con caracteres especiales (═══, ─── )
- Incluye todos los componentes
- Incluye evaluación IA si existe
- Fácil de pegar en cualquier chat o documento

**Cómo usar:**
1. Abre el modal de detalles de tu ensamble
2. Haz clic en el botón "📋 Copiar Texto"
3. El texto se copia al portapapeles
4. Pégalo donde necesites

**Ejemplo de formato:**
```
╔════════════════════════════════════╗
║    MI PC GAMING - PC Assembler     ║
╚════════════════════════════════════╝

🔌 MOTHERBOARD
   ─────────────────────────
   ASUS ROG Strix B550-F Gaming
   Socket: AM4
   Precio: $200

⚡ CPU
   ─────────────────────────
   AMD Ryzen 5 5600X
   Núcleos: 6
   Precio: $299

[... más componentes ...]

🤖 EVALUACIÓN IA
═══════════════════════════════════

⭐ Puntuación: 8.5/10

📝 Resumen:
Excelente configuración para gaming...

[... más detalles de IA ...]
```

---

## 🔒 Privacidad y Seguridad

### Control de Compartir
- Por defecto, los ensambles son **privados**
- Solo tú puedes ver tus ensambles sin compartir
- Al generar un link público, el ensamble se marca como `es_publico: true`
- Puedes desactivar el link público en cualquier momento

### Gestión del Link Público
Para desactivar un link público (futuro):
1. Ve a la configuración del ensamble
2. Haz clic en "Desactivar compartir"
3. El link dejará de funcionar inmediatamente

---

## 🎨 Página Pública

Cuando alguien visita tu link público, verá:

### Diseño
- Mismo diseño hermoso con gradientes azul-púrpura
- Componentes organizados en tarjetas con colores distintivos
- Evaluación IA con todas las secciones (si existe)
- Costo total destacado
- Footer con branding "PC Assembler 🚀"

### Información Mostrada
- **Nombre del ensamble** y **creador**
- **Todos los componentes** con especificaciones completas:
  - 🔌 Motherboard (socket, chipset, slots)
  - ⚡ CPU (núcleos, frecuencia, TDP)
  - 🎮 GPU (VRAM, TDP)
  - 💾 RAM (capacidad, velocidad)
  - 💿 Storage (capacidad, tipo)
  - 🔋 PSU (potencia, certificación)
  - 🏠 Case (factor de forma)
  - 🖥️ Monitor (tamaño, resolución, tasa de refresco)

- **Evaluación IA** (si existe):
  - ⭐ Puntuación general con estrellas
  - 📝 Resumen
  - ✅ Puntos fuertes
  - ⚠️ Puntos débiles
  - 🎯 Uso recomendado
  - 💡 Recomendaciones
  - Y más...

- **Costo total** del ensamble

### Limitaciones
- Solo lectura (no se puede editar)
- No muestra datos privados del usuario
- Solo muestra ensambles marcados como públicos

---

## 🛠️ Aspectos Técnicos

### Backend
- **Endpoint para generar link:** `POST /api/share-ensamble/:id`
- **Endpoint para ver compartido:** `GET /api/shared/:token`
- **Endpoint para desactivar:** `DELETE /api/share-ensamble/:id`

### Base de Datos
El modelo `Ensamble` incluye:
```prisma
model Ensamble {
  token_compartir  String? @unique  // Token único para compartir
  es_publico       Boolean @default(false)  // Si está disponible públicamente
  // ... otros campos
}
```

### Frontend
- **Página pública:** `/shared/[token]`
- Diseño responsivo con Tailwind CSS
- Estados de carga y error manejados
- No requiere autenticación

---

## 📊 Casos de Uso

### Para Gamers
- Comparte tu build de gaming con amigos
- Pide opiniones antes de comprar
- Muestra tu setup en foros y comunidades

### Para Profesionales
- Comparte especificaciones con clientes
- Envía cotizaciones profesionales en PDF
- Presenta configuraciones de trabajo

### Para Educación
- Enseña cómo armar PCs
- Compara diferentes configuraciones
- Muestra ejemplos de builds balanceados

---

## 🚀 Tips y Mejores Prácticas

1. **Evalúa con IA antes de compartir** - La evaluación hace tu build más profesional
2. **Usa nombres descriptivos** - Facilita identificar el ensamble
3. **Actualiza antes de compartir** - Asegúrate de que todo esté correcto
4. **Elige el formato adecuado:**
   - PDF para presentaciones formales
   - Link público para compartir online
   - Texto para chats y foros

---

## ⚠️ Notas Importantes

- Los links públicos NO expiran automáticamente
- Puedes tener múltiples ensambles públicos
- El mismo token se reutiliza si compartes el mismo ensamble varias veces
- Al modificar un ensamble compartido, el link sigue funcionando con los datos actualizados
- La evaluación IA se elimina si modificas componentes, pero el link sigue activo

---

## 🔮 Próximas Funcionalidades

- [ ] Contador de vistas para links públicos
- [ ] Expiración automática de links
- [ ] Compartir en redes sociales directamente
- [ ] Generar imagen/preview del ensamble
- [ ] Estadísticas de compartidos
- [ ] Comentarios en ensambles públicos

---

**Creado con ❤️ por el equipo de PC Assembler**
