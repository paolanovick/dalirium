# DALIRIUM - Museo Virtual Salvador Dalí 🎨

Galería de arte interactiva dedicada a Salvador Dalí con arquitectura moderna de microservicios.

## 🌐 Sitio en Vivo

- **Frontend**: https://dalirium.vercel.app
- **Backend API**: https://167.172.31.249:3001
- **GitHub**: https://github.com/paolanovick/dalirium

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (BROWSER)                       │
│                      https://dalirium.vercel.app               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    React 19 + Vite
                   Tailwind CSS + Router
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                     BACKEND API (Node.js)                       │
│              Digital Ocean - Puerto 3001 (PM2)                  │
│                      Express.js + Mongoose                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
   ┌─────────┐          ┌──────────┐        ┌──────────┐
   │ MongoDB │          │Cloudinary│        │  n8n    │
   │ Atlas   │          │ (Imágenes)        │(Webhook)│
   └─────────┘          └──────────┘        └──────────┘
```

---

## 🎯 Características Principales

### Frontend (Vercel)
- ✅ **Galería Interactiva**: Carruseles con scroll suave
- ✅ **Categorías Dinámicas**: Relojes, Vajilla, Cuadros, Esculturas, etc.
- ✅ **Loading State**: Spinner mientras carga las obras
- ✅ **Responsive Design**: Móvil, tablet y desktop
- ✅ **Footer Dinámico**: Categorías generadas automáticamente
- ✅ **Deduplicación de Imágenes**: Sin duplicados en la galería
- ✅ **Detalle de Obra**: Vista completa con miniaturas (estilo MercadoLibre)

### Backend (Digital Ocean)
- ✅ **API RESTful**: CRUD completo de obras
- ✅ **MongoDB**: Base de datos en la nube (Atlas)
- ✅ **Autenticación**: Login para panel admin (próximamente)
- ✅ **CORS**: Integración segura con frontend
- ✅ **PM2**: Mantiene servidor corriendo 24/7

### Base de Datos
```javascript
{
  _id: ObjectId(),
  slug: "vajilla-001",
  titulo: "Vajilla #1",
  categoria: "vajilla",
  subcategoria: "vajilla",
  imagenPrincipal: "20240829_163819_gsebhp",  // public_id Cloudinary
  imagenes: [
    "20240829_163819_gsebhp",
    "20240829_163814_uekret",
    "20240829_163807_byf15m"
  ],
  orden: 1,
  precio: "Consultar",
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📱 Diseño Responsive

### Móvil (< 768px)
- Botón hamburguesa en navbar
- Sidebar deslizable desde izquierda
- Navegación vertical
- Imágenes optimizadas

### Tablet/Desktop (≥ 768px)
- Navegación horizontal en navbar
- Sin sidebar
- Layout en grid
- Hover effects en carrusel

---

## 🚀 Instalación & Desarrollo

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Accede a `http://localhost:5173`

### Backend

```bash
cd backend
npm install
npm start
```

Servidor en `http://localhost:3001`

**Desarrollo con hot-reload:**
```bash
npm run dev  # (requiere nodemon instalado)
```

---

## 🔑 Variables de Entorno

### Frontend (`.env.local`)
```
VITE_API_URL=http://localhost:3001
```

### Backend (`.env`)
```
PORT=3001
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/dalirium
NODE_ENV=production
JWT_SECRET=tu_secret_key_aqui
```

---

## 📚 Endpoints API

### Obras
```
GET    /api/obras              # Obtener todas las obras
GET    /api/obras/:id          # Obtener obra por ID
GET    /api/obras/slug/:slug   # Obtener obra por slug
POST   /api/obras              # Crear nueva obra (admin)
PUT    /api/obras/:id          # Actualizar obra (admin)
DELETE /api/obras/:id          # Eliminar obra (admin)
```

### Categorías
```
GET    /api/categorias         # Obtener todas las categorías
```

### Health Check
```
GET    /api/health             # Verificar estado del servidor
```

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Framework UI
- **Vite** - Build tool (dev server ultra rápido)
- **React Router v7** - Navegación SPA
- **Tailwind CSS** - Estilos utilitarios
- **Motion** - Animaciones fluidas

### Backend
- **Node.js 20** - Runtime JavaScript
- **Express.js** - Framework web
- **Mongoose** - ODM para MongoDB
- **PM2** - Process manager
- **CORS** - Cross-origin requests
- **dotenv** - Variables de entorno

### Base de Datos & Servicios
- **MongoDB Atlas** - Base de datos en la nube (free tier)
- **Cloudinary** - CDN para imágenes
- **Digital Ocean** - VPS (2GB RAM, Ubuntu 25.04)
- **Vercel** - Hosting frontend
- **GitHub** - Control de versiones

---

## 📊 Flujo de Datos

1. **Usuario accede** → https://dalirium.vercel.app
2. **Frontend carga** → React renderiza la página
3. **Spinner aparece** → "Cargando obras..."
4. **API llama al backend** → GET `/api/obras`
5. **Backend consulta MongoDB** → Devuelve obras
6. **Cloudinary sirve imágenes** → URLs desde CDN
7. **Carrusel renderiza** → Galerías por categoría

---

## 🔄 Próximos Pasos

### Fase 2: Dashboard Admin
- [ ] Pantalla de login
- [ ] CRUD de obras con UI
- [ ] Selector de imágenes de Cloudinary
- [ ] Drag & drop para ordenar
- [ ] Cambiar imagen principal

### Fase 3: Colección Privada
- [ ] Autenticación de usuario
- [ ] Obras exclusivas con acceso restringido
- [ ] Formulario de consulta en contacto

### Fase 4: Mejoras
- [ ] Búsqueda de obras
- [ ] Filtros avanzados
- [ ] Optimización de imágenes
- [ ] Dark/Light mode
- [ ] Multi-idioma

---

## 🚀 Deploy

### Frontend (Vercel - Automático)
```bash
git push origin main
# Vercel detecta cambios y redeploy automático
```

### Backend (Digital Ocean - Manual)
```bash
# SSH al servidor
ssh root@167.172.31.249

# Actualizar código
cd /root/dalirium-backend
git pull origin main

# Reiniciar con PM2
pm2 restart dalirium-backend
pm2 logs dalirium-backend
```

---

## 📝 Notas de Desarrollo

### Deduplicación de Imágenes
Las imágenes se deduplicación por `public_id` de Cloudinary para evitar duplicados que n8n trae múltiples veces.

### Variables de Entorno Sensibles
**NUNCA** commitear `.env` con credenciales reales. Usar `.env.example`:
```bash
cp .env.example .env
# Completar valores locales
```

### PM2 Comandos Útiles
```bash
pm2 start index.js --name "dalirium"      # Iniciar
pm2 list                                   # Listar procesos
pm2 logs dalirium-backend                 # Ver logs
pm2 restart dalirium-backend              # Reiniciar
pm2 stop dalirium-backend                 # Detener
pm2 delete dalirium-backend               # Eliminar
```

---

## 👤 Autor

**Paola Novick** - Desarrolladora Full Stack
- Email: paola.novick@davinci.edu.ar
- GitHub: @paolanovick
- Portfolio: ConCodigoART

---

## 📄 Licencia

© 2025 Dalirium. Todos los derechos reservados.



**Última actualización**: 21 de Enero de 2025

**Estado**: 🟢 En producción (Frontend + Backend + DB)