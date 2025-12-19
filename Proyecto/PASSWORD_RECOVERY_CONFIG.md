# Configuración de Recuperación de Contraseña

## 🚀 Configuración de Gmail App Password (REQUERIDO)

### Paso 1: Habilitar Verificación en 2 Pasos

1. Ve a tu cuenta de Google: https://myaccount.google.com/security
2. En la sección **"Cómo inicias sesión en Google"**, busca **"Verificación en 2 pasos"**
3. Haz clic en **"Verificación en 2 pasos"**
4. Sigue las instrucciones para configurarla (necesitarás tu teléfono)
5. **IMPORTANTE**: La verificación en 2 pasos DEBE estar activada para crear App Passwords

### Paso 2: Generar App Password

1. Una vez activada la verificación en 2 pasos, ve a: https://myaccount.google.com/apppasswords
   - **O** busca "App Passwords" en la configuración de tu cuenta de Google
   
2. Si te pide iniciar sesión de nuevo, hazlo

3. En la página de "Contraseñas de aplicaciones":
   - **App:** Selecciona **"Correo"** (Mail)
   - **Dispositivo:** Selecciona **"Otro (nombre personalizado)"**
   - Escribe: **"PC Builder App"**
   - Haz clic en **"Generar"**

4. Google te mostrará una contraseña de **16 caracteres** como:
   ```
   abcd efgh ijkl mnop
   ```

5. **¡IMPORTANTE!** Copia esta contraseña SIN ESPACIOS:
   ```
   abcdefghijklmnop
   ```

### Paso 3: Actualizar el archivo .env

1. Abre el archivo `Backend/.env`

2. Actualiza estas líneas con TU información:
   ```env
   EMAIL_USER="tucorreo@gmail.com"          # Tu email de Gmail
   EMAIL_PASS="abcdefghijklmnop"            # App Password SIN espacios
   NODE_ENV="production"                     # Cambiar a production
   ```

3. **Guarda el archivo**

### Paso 4: Reiniciar el Servidor

```bash
cd Backend
npm run dev
```

---

## ✅ Verificar que Funciona

1. Ve a tu aplicación: `http://localhost:3000/forgot-password`
2. Ingresa un email válido registrado en tu base de datos
3. Revisa el email (puede tardar unos segundos)
4. **Revisa la carpeta de SPAM** si no llega a la bandeja principal

---

## 🔧 Modo Desarrollo vs Producción

### Desarrollo (NODE_ENV != "production")
- ✅ No envía emails reales
- ✅ Muestra el token en la consola del servidor
- ✅ No requiere configurar Gmail
- ✅ Útil para desarrollo local

### Producción (NODE_ENV = "production")
- ✅ Envía emails reales usando Gmail
- ✅ Requiere App Password configurado
- ✅ Los usuarios reciben el email en su bandeja

**Para cambiar entre modos**, edita `Backend/.env`:
```env
NODE_ENV="development"  # Modo desarrollo (consola)
NODE_ENV="production"   # Modo producción (email real)
```

---

## 🚨 Solución de Problemas

### Error: "Invalid login: 535"
**Causa:** La contraseña de app es incorrecta o la verificación en 2 pasos no está activada

**Solución:**
1. Verifica que la verificación en 2 pasos esté activa
2. Genera una NUEVA App Password
3. Copia la contraseña SIN espacios
4. Actualiza el `.env`
5. Reinicia el servidor

### El email no llega
**Solución:**
1. Revisa la **carpeta de SPAM**
2. Verifica que el email en `.env` sea el correcto
3. Revisa los logs del servidor (debe decir "Password reset email sent to: email@ejemplo.com")
4. Verifica que `NODE_ENV="production"`

### Error: "Error sending password reset email"
**Solución:**
1. Revisa que `EMAIL_USER` y `EMAIL_PASS` estén correctos en `.env`
2. Asegúrate de que la App Password sea de 16 caracteres sin espacios
3. Verifica tu conexión a internet
4. Intenta generar una nueva App Password

---

## 📧 Configuración para Deploy (Producción Real)

Cuando subas tu aplicación a producción (Vercel, Railway, etc.):

### Variables de Entorno a Configurar:

```env
DATABASE_URL="tu-url-de-postgres-en-produccion"
JWT_SECRET="tu-secret-seguro-aleatorio"
EMAIL_USER="tucorreo@gmail.com"
EMAIL_PASS="tu-app-password-de-16-caracteres"
NODE_ENV="production"
CLOUDINARY_CLOUD_NAME="tu-cloudinary-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"
```

### URL del Frontend en Producción

Actualiza la URL en `Backend/src/services/userService.js` línea ~157:

```javascript
// Cambiar de:
http://localhost:3000/reset-password?token=${token}

// A:
https://tu-dominio.com/reset-password?token=${token}
```

---

## 🔒 Seguridad

- ✅ Nunca compartas tu App Password
- ✅ Nunca subas el archivo `.env` a GitHub
- ✅ Usa variables de entorno en producción
- ✅ Los tokens expiran en 1 hora
- ✅ Las contraseñas se encriptan con bcrypt

---

## 📱 Contacto

Si tienes problemas con la configuración, revisa:
- Los logs del servidor backend
- La consola del navegador
- Que todos los servicios estén corriendo
