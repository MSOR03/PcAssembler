# Guía de Búsqueda Avanzada - PC Assembler

## 📋 Descripción General

La página de **Búsqueda Avanzada** es una interfaz completa para explorar y filtrar todos los componentes de PC disponibles en la base de datos. Ofrece filtros múltiples, dos vistas de visualización, ordenamiento dinámico y visualización detallada de especificaciones técnicas.

## 🎯 Características Principales

### 1. **Sistema de Filtrado Completo**

#### Filtros Disponibles:
- **🔍 Búsqueda por Texto**: Búsqueda en nombre y descripción de componentes
- **📦 Categoría**: Filtra por tipo de componente (CPU, GPU, RAM, etc.)
- **🏷️ Marca**: Filtra por fabricante (Intel, AMD, NVIDIA, etc.)
- **💵 Precio Mínimo**: Establece el precio mínimo del rango
- **💰 Precio Máximo**: Establece el precio máximo del rango
- **⭐ Rating Mínimo**: Filtra por calificación de usuarios (2+, 3+, 4+)

#### Opciones de Ordenamiento:
- **Nombre (A-Z)**: Orden alfabético
- **Precio (Menor a Mayor)**: Productos más económicos primero
- **Precio (Mayor a Menor)**: Productos más caros primero
- **Rating (Mayor a Menor)**: Mejor calificados primero

### 2. **Modos de Visualización**

#### Vista de Cuadrícula (Grid)
- Diseño en tarjetas con 4 columnas en pantallas XL
- 3 columnas en pantallas grandes
- 2 columnas en tablets
- 1 columna en móviles
- Muestra imagen grande, nombre, precio y **3 especificaciones clave**

#### Vista de Lista (List)
- Diseño horizontal para mayor detalle
- Imagen a la izquierda con información extendida
- Especificaciones clave en badges horizontales
- Ideal para comparación rápida

### 3. **Especificaciones Prominentes**

El sistema muestra automáticamente las **3 especificaciones más relevantes** según la categoría del componente:

| Categoría | Especificaciones Destacadas |
|-----------|---------------------------|
| **CPU/Procesador** | Núcleos • Frecuencia • Socket |
| **GPU/Tarjeta Gráfica** | VRAM • Boost Clock • TDP |
| **RAM/Memoria** | Capacidad • Tipo • Velocidad |
| **Motherboard** | Socket • Chipset • Formato |
| **Almacenamiento** | Capacidad • Tipo • Interfaz |
| **Fuente de Poder** | Potencia • Certificación • Modular |
| **Gabinete/Case** | Formato • Color • Ventanas |
| **Monitor** | Tamaño • Resolución • Tasa de Refresco |

### 4. **Modal de Detalles Completos**

Al hacer clic en "Ver Detalles Completos" se abre un modal con:

- **Imagen Grande**: Alta resolución del producto
- **Precio Destacado**: Con diseño en gradiente
- **Rating Visual**: Sistema de estrellas si está disponible
- **Descripción Completa**: Información detallada del producto
- **Todas las Especificaciones**: Tabla completa con todas las características técnicas
- **Indicador de Stock**: Disponibilidad del producto
- **Botón de Acción**: "Agregar al Ensamble" (futuro desarrollo)

### 5. **Badges de Filtros Activos**

Muestra chips visuales de los filtros aplicados:
- Badge azul para categoría seleccionada
- Badge morado para marca seleccionada
- Badge verde para rango de precios
- Badge amarillo para rating mínimo

Permite ver rápidamente qué filtros están activos.

## 🎨 Diseño Visual

### Elementos de Diseño:
- **Gradientes Modernos**: Fondos con degradados sutiles (gris → azul → púrpura)
- **Glassmorphism**: Paneles con efecto de vidrio esmerilado (backdrop-blur)
- **Sombras Dinámicas**: Sombras que aumentan en hover
- **Animaciones Suaves**: Transiciones y transformaciones en hover
- **Tarjetas Elevadas**: Efecto 3D al pasar el mouse (transform scale)
- **Iconos SVG**: Iconografía moderna y escalable
- **Responsive Design**: Adaptable a todos los tamaños de pantalla

### Paleta de Colores:
- **Primario**: Azul (#2563eb) → Púrpura (#9333ea)
- **Secundario**: Rosa (#ec4899)
- **Acento**: Verde (#059669) para precios
- **Rating**: Amarillo (#facc15)
- **Texto**: Gris oscuro (light) / Blanco (dark)

## 📱 Accesibilidad

### Navegación:
- Disponible desde el **NavBar** principal (Desktop y Mobile)
- Ruta: `/busqueda-avanzada`
- Enlace visible: "Búsqueda Avanzada"

### Características de Accesibilidad:
- Contraste alto en modo oscuro y claro
- Labels descriptivos en todos los inputs
- Botones con íconos y texto
- Animaciones suaves sin parpadeos
- Tamaños de click generosos (touch-friendly)
- Mensajes de error y estados vacíos claros

## 🔧 Implementación Técnica

### Tecnologías:
- **React 18** con Hooks (useState, useEffect)
- **Next.js 15** (App Router)
- **TailwindCSS** para estilos
- **Next/Image** para optimización de imágenes
- **Cloudinary** para gestión de imágenes

### Estados Principales:
```javascript
- components: Todos los componentes de la BD
- filteredComponents: Componentes después de aplicar filtros
- filters: Objeto con todos los valores de filtros
- sortBy: Criterio de ordenamiento actual
- viewMode: 'grid' o 'list'
- showDetails: Controla visibilidad del modal
- selectedComponent: Componente seleccionado para ver detalles
```

### Funciones Clave:
- `getUniqueCategories()`: Extrae categorías únicas para dropdown
- `getUniqueBrands()`: Extrae marcas únicas para dropdown
- `getKeySpecs(component)`: Determina las 3 specs más relevantes por categoría
- `getRatingBadge(rating)`: Genera badge visual de rating
- `handleFilterChange()`: Actualiza valores de filtros
- `clearFilters()`: Resetea todos los filtros
- `showComponentDetails()`: Abre modal con componente seleccionado

### Flujo de Datos:
1. **Fetch Inicial**: Obtiene todos los componentes de `/api/componentes`
2. **Aplicación de Filtros**: useEffect filtra basado en criterios activos
3. **Ordenamiento**: Aplica sort según `sortBy` seleccionado
4. **Renderizado**: Muestra en vista grid o list según `viewMode`

## 🚀 Uso de la Funcionalidad

### Para Usuarios Finales:

1. **Acceder**: Clic en "Búsqueda Avanzada" en el menú
2. **Filtrar**: Seleccionar criterios deseados (categoría, marca, precio, etc.)
3. **Visualizar**: Cambiar entre vista cuadrícula o lista
4. **Ordenar**: Elegir criterio de ordenamiento
5. **Ver Detalles**: Clic en "Ver Detalles Completos" para información técnica
6. **Limpiar**: Botón "Limpiar Filtros" para resetear búsqueda

### Ejemplos de Casos de Uso:

**Caso 1: Buscar GPUs de NVIDIA bajo $1000**
- Categoría: GPU / Tarjeta Gráfica
- Marca: NVIDIA
- Precio Máx: 1000
- Ordenar: Precio (Menor a Mayor)

**Caso 2: Ver todos los procesadores de 4+ estrellas**
- Categoría: CPU / Procesador
- Rating Mínimo: 4+ Estrellas
- Ordenar: Rating (Mayor a Menor)

**Caso 3: Comparar monitores de 27 pulgadas**
- Búsqueda: "27"
- Categoría: Monitor
- Vista: Lista (para comparar specs horizontalmente)

## 💡 Buenas Prácticas

### Para Desarrolladores:

1. **Mantener Especificaciones Actualizadas**: 
   - Asegurar que la función `getKeySpecs()` refleje las specs más importantes por categoría
   - Agregar nuevas categorías según sea necesario

2. **Optimización de Imágenes**:
   - Usar Cloudinary para todas las imágenes
   - Fallback a placeholder si la imagen falla

3. **Performance**:
   - El filtrado es en memoria (client-side)
   - Para BD grandes (>1000 items), considerar paginación
   - Lazy loading de imágenes con Next/Image

4. **Extensibilidad**:
   - Fácil agregar nuevos filtros modificando el estado `filters`
   - Nuevas categorías de specs se agregan en `getKeySpecs()`

## 🐛 Solución de Problemas

### Problemas Comunes:

**Problema**: Las especificaciones no se muestran
- **Solución**: Verificar que `component.especificaciones` sea un objeto JSON válido en la BD

**Problema**: Los filtros no funcionan
- **Solución**: Comprobar que los nombres de campos coincidan con la estructura de datos del backend

**Problema**: Imágenes no cargan
- **Solución**: Verificar configuración de Cloudinary y que `imagenUrl` esté presente

**Problema**: El modal no cierra
- **Solución**: Revisar que `closeDetails()` esté conectado correctamente al botón X

## 🔮 Futuras Mejoras

### Funcionalidades Planeadas:

1. **Comparación de Productos**: 
   - Selección múltiple para comparar specs lado a lado

2. **Guardado de Búsquedas**:
   - Guardar filtros favoritos para búsquedas recurrentes

3. **Integración con Carrito**:
   - Botón "Agregar al Ensamble" funcional

4. **Filtros Avanzados**:
   - Rangos de especificaciones (ej: 8-16 núcleos)
   - Filtros por compatibilidad con otros componentes

5. **Paginación**:
   - Para mejorar performance con muchos productos

6. **Historial de Búsqueda**:
   - Ver búsquedas recientes del usuario

## 📞 Soporte

Para preguntas o problemas relacionados con la Búsqueda Avanzada, contactar al equipo de desarrollo o abrir un issue en el repositorio del proyecto.

---

**Última Actualización**: Mayo 2024
**Versión**: 1.0.0
