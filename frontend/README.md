# DALIRIUM - Museo Virtual Salvador Dalí 🎨

Galería de arte interactiva dedicada a Salvador Dalí con arquitectura moderna de microservicios.

## 🌐 Sitio en Vivo

- **Frontend**: https://dalirium.vercel.app
- **Backend API**: https://api.triptest.com.ar/dalirium
- **Admin Dashboard**: https://dalirium.vercel.app/admin
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
│                      NGINX (Reverse Proxy)                      │
│              api.triptest.com.ar - SSL/HTTPS                   │
└────────────────────────────┬────────────────────────────────────┘
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
   │ MongoDB │          │Cloudinary│        │   n8n    │
   │ Atlas   │          │(Imágenes)│        │(Webhook) │
   └─────────┘          └──────────┘        └──────────┘
```

---

## 🎯 Características Principales

### Frontend (Vercel)
- ✅ **Galería Interactiva**: Carruseles con efecto coverflow (Swiper.js)
- ✅ **Categorías Dinámicas**: Relojes, Vajilla, Cuadros, Esculturas, Litografías, etc.
- ✅ **Loading State**: Spinner mientras carga las obras
- ✅ **Responsive Design**: Móvil, tablet y desktop
- ✅ **Footer Dinámico**: Categorías generadas automáticamente
- ✅ **Deduplicación de Imágenes**: Sin duplicados en la galería
- ✅ **Detalle de Obra**: Vista completa con miniaturas
- ✅ **Sistema Híbrido**: Combina datos de MongoDB (editados) y n8n (automáticos)

### Backend (Digital Ocean)
- ✅ **API RESTful**: CRUD completo de obras
- ✅ **MongoDB Atlas**: Base de datos en la nube
- ✅ **CORS Configurado**: Integración segura con frontend
- ✅ **PM2**: Mantiene servidor corriendo 24/7
- ✅ **Nginx + SSL**: HTTPS via Let's Encrypt

### Dashboard Admin
- ✅ **Panel de Administración**: Accesible en `/admin`
- ✅ **CRUD de Obras**: Crear, editar, eliminar obras
- ✅ **Selector Visual de Imágenes**: Muestra imágenes de Cloudinary
- ✅ **Imagen Principal (★)**: Selección con un click
- ✅ **Imágenes Secundarias (✓)**: Multi-selección
- ✅ **Subida de Imágenes**: Directo a Cloudinary desde el navegador

### Base de Datos (MongoDB)
```javascript
{
  _id: ObjectId(),
  slug: "litografia-001",
  titulo: "Litografía Don Quijote",
  categoria: "litografias",
  subcategoria: "litografias",
  imagenPrincipal: "dalirium/litografias/imagen_abc123",  // public_id Cloudinary
  imagenes: [
    "dalirium/litografias/imagen_abc123",
    "dalirium/litografias/imagen_def456",
    "dalirium/litografias/imagen_ghi789"
  ],
  orden: 1,
  precio: "Consultar",
  descripcion: "",
  tecnica: "",
  dimensiones: "",
  año: "",
  destacada: true,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Sistema Híbrido de Datos

El frontend combina dos fuentes de datos:

### MongoDB (Prioridad)
- Obras editadas/creadas desde el admin
- Control total sobre imagen principal y secundarias
- Si una **categoría** tiene obras en MongoDB, usa solo esas

### n8n (Fallback)
- Obras automáticas vía webhook
- Agrupamiento por timestamp (imágenes tomadas en 2 minutos = misma obra)
- Se usa para categorías **no editadas** en el admin

```javascript
// Lógica en obras.js
const mongoCategories = new Set(mongoObras.map(o => o.categoria));
const n8nFiltered = n8nObras.filter(o => !mongoCategories.has(o.categoria));
obrasCache = [...mongoObras, ...n8nFiltered];
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

---

## 🔑 Variables de Entorno

### Frontend (Vercel - Environment Variables)
```
VITE_API_URL=https://api.triptest.com.ar/dalirium
```

### Backend (`.env`)
```
PORT=3001
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/dalirium
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=dwz6kggqe
CLOUDINARY_API_KEY=833793194928761
CLOUDINARY_API_SECRET=[secret]
```

### Cloudinary
- **Upload Preset**: `dalirium_unsigned` (Unsigned, para subida desde frontend)
- **Carpetas**: `dalirium/{categoria}` (ej: `dalirium/litografias`)

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

### Cloudinary
```
GET    /api/cloudinary/:carpeta    # Listar imágenes de una carpeta
```

### Health Check
```
GET    /api/health             # Verificar estado del servidor
```

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Framework UI
- **Vite** - Build tool
- **React Router v7** - Navegación SPA
- **Tailwind CSS** - Estilos utilitarios
- **Swiper.js** - Carruseles con efecto coverflow

### Backend
- **Node.js 20** - Runtime JavaScript
- **Express.js** - Framework web
- **Mongoose** - ODM para MongoDB
- **Multer** - Manejo de archivos
- **PM2** - Process manager
- **CORS** - Cross-origin requests

### Infraestructura
- **MongoDB Atlas** - Base de datos en la nube
- **Cloudinary** - CDN para imágenes + Upload directo
- **Digital Ocean** - VPS (Ubuntu)
- **Nginx** - Reverse proxy + SSL
- **Let's Encrypt** - Certificados SSL
- **Vercel** - Hosting frontend
- **n8n** - Automatización de webhooks

---

## 📊 Flujo de Datos

### Galería Pública
1. Usuario accede → https://dalirium.vercel.app
2. Frontend carga → React renderiza
3. `obras.js` consulta MongoDB y n8n en paralelo
4. Combina resultados (MongoDB tiene prioridad por categoría)
5. Cloudinary sirve imágenes
6. Carrusel renderiza obras

### Admin Dashboard
1. Admin accede → https://dalirium.vercel.app/admin
2. Crea/edita obra → Selecciona categoría
3. Frontend consulta → `GET /api/cloudinary/{categoria}`
4. Muestra imágenes de Cloudinary
5. Admin selecciona principal (★) y secundarias (✓)
6. Puede subir nuevas imágenes → Directo a Cloudinary
7. Guarda → `POST/PUT /api/obras`
8. Datos en MongoDB

---

## 🔧 Configuración Nginx

```nginx
# /etc/nginx/sites-available/api.triptest.com.ar

server {
    listen 443 ssl http2;
    server_name api.triptest.com.ar;
    
    ssl_certificate /etc/letsencrypt/live/api.triptest.com.ar/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.triptest.com.ar/privkey.pem;

    # n8n
    location / {
        proxy_pass http://localhost:5678;
        # ... headers
    }

    # Dalirium Backend
    location /dalirium/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

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

### Nginx (Si se modifica)
```bash
nginx -t
systemctl reload nginx
```

---

## 📝 Notas Técnicas

### MongoDB Atlas - IP Whitelist
El servidor de Digital Ocean (`167.172.31.249`) debe estar en la whitelist de MongoDB Atlas para conectarse.

### Cloudinary Upload Preset
- Nombre: `dalirium_unsigned`
- Modo: **Unsigned** (permite subida desde frontend)
- Las imágenes se organizan en carpetas: `dalirium/{categoria}`

### CORS
Configurado en Express para permitir requests desde cualquier origen:
```javascript
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
```

### PM2 Comandos Útiles
```bash
pm2 list                          # Listar procesos
pm2 logs dalirium-backend         # Ver logs
pm2 restart dalirium-backend      # Reiniciar
pm2 stop dalirium-backend         # Detener
```

---

## ✅ Features Completados

### Dashboard Admin
- [x] Listado de obras con imagen, título, categoría y orden
- [x] Formulario para crear y editar obras
- [x] Selector visual de imágenes desde Cloudinary
- [x] Selección de imagen principal (★) y secundarias (✓)
- [x] Subida de imágenes directo a Cloudinary
- [x] Operaciones CRUD completas contra MongoDB

### Sistema Híbrido
- [x] Carga paralela de MongoDB y n8n
- [x] Prioridad por categoría a MongoDB
- [x] Fallback a n8n para categorías no editadas

### Carrusel
- [x] Efecto coverflow con Swiper.js
- [x] Marco dorado decorativo (estética Dalí)
- [x] Fondo con degradado cálido
- [x] Transiciones suaves

---

## 🔜 Próximos Pasos

### Fase 3: Colección Privada
- [ ] Autenticación de usuario
- [ ] Obras exclusivas con acceso restringido
- [ ] Formulario de consulta en contacto

### Fase 4: Mejoras
- [ ] Búsqueda de obras
- [ ] Filtros avanzados
- [ ] Dark/Light mode
- [ ] Multi-idioma
- [ ] Login para admin

---

## 👤 Autor

**Paola Novick** - Desarrolladora Full Stack
- Email: paola.novick@davinci.edu.ar
- GitHub: @paolanovick
- Portfolio: ConCodigoART

---

## 📄 Licencia

© 2025 Dalirium. Todos los derechos reservados.

---

**Última actualización**: 23 de Enero de 2026

**Estado**: 🟢 En producción (Frontend + Backend + Admin + Sistema Híbrido)
