// =====================================================
// OBRAS.JS - Cloudinary + n8n (Dalirium)
// =====================================================
/* eslint-disable no-unused-vars */

const N8N_WEBHOOK_URL = "https://n8n.triptest.com.ar/webhook/dalirium";

// =====================================================
// MAPEO DE CATEGORÍAS
// =====================================================
const categoryMapping = {
  "relojes": "relojes",
  "pulsera-joya-cristal-oscuro": "relojes",
  "medallas-olimpicas": "medallas-olimpicas",
  "juegos-olimpicos": "juegos-olimpicos",
  "litografias": "litografias",
  "litografías": "litografias",  // ← AGREGA ESTO (con acento)
  "fotos-textos": "fotos-textos",
  "esculturas": "esculturas",
  "daga": "daga",
  "cuadros": "cuadros",
  "cuadros-chicos": "cuadros-chicos",
  "vajilla": "vajilla",
  "certificados": "certificados",
  "sin-categoria": "coleccion-privada"
};
// =====================================================
// UTILIDADES
// =====================================================

function extractNumber(name) {
  if (!name || typeof name !== "string") return 0;
  const match = name.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function generateSlug(base, index) {
  const clean = base.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return clean + '-' + String(index + 1).padStart(3, '0');
}

function generateTitle(base, index) {
  const title = base
    .replace(/-/g, ' ')
    .replace(/\b\w/g, function(l) { return l.toUpperCase(); });
  return title + ' #' + (index + 1);
}

function groupConsecutiveImages(images, maxGap) {
  if (maxGap === undefined) maxGap = 3;
  if (!images || images.length === 0) return [];

  var sorted = images.slice().sort(function(a, b) {
    return extractNumber(a.nombre) - extractNumber(b.nombre);
  });

  var groups = [];
  var current = [sorted[0]];

  for (var i = 1; i < sorted.length; i++) {
    var gap = extractNumber(sorted[i].nombre) - extractNumber(sorted[i - 1].nombre);

    if (gap > 0 && gap <= maxGap) {
      current.push(sorted[i]);
    } else {
      groups.push(current);
      current = [sorted[i]];
    }
  }

  groups.push(current);
  return groups;
}

// =====================================================
// PROCESAMIENTO
// =====================================================

function processObras(jsonData) {
  var obras = [];
  var globalId = 1;
  var imagesByFolder = {};

  // 1️⃣ Agrupar imágenes por carpeta
  Object.keys(jsonData).forEach(function(key) {
    var responses = jsonData[key];
    responses.forEach(function(res) {
      if (res.resources && Array.isArray(res.resources)) {
        res.resources.forEach(function(img) {
          var folder = img.asset_folder || "sin-carpeta";
          var folderName = folder.split("/").pop();

          if (!imagesByFolder[folderName]) {
            imagesByFolder[folderName] = [];
          }
          imagesByFolder[folderName].push(img);
        });
      }
    });
  });

  // 2️⃣ Por cada carpeta, agrupar en SERIES y crear OBRAS
// 2️⃣ Por cada carpeta, agrupar en SERIES y crear OBRAS
Object.keys(imagesByFolder).forEach(function(folderName) {
  var imagenes = imagesByFolder[folderName];

  // 🔑 DEDUPLICAR por public_id (eliminar duplicados)
  var visto = {};
  imagenes = imagenes.filter(function(img) {
    var id = img.public_id;
    if (visto[id]) return false;  // Si ya lo vimos, descartarlo
    visto[id] = true;
    return true;
  });

  var categoriaKey = folderName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

  var categoria = categoryMapping[categoriaKey] || "coleccion-privada";
console.log("📁", folderName, "- Antes:", imagesByFolder[folderName].length, "Después:", imagenes.length);
  // 🔑 Agrupar imágenes por números cercanos (series)
  var series = groupConsecutiveImages(imagenes, 3);
  
  // ... resto igual

    // Por cada serie, crear una "obra"
    series.forEach(function(grupo, serieIndex) {
      var slugBase = folderName.toLowerCase().replace(/\s+/g, '-');
      
      obras.push({
        id: globalId++,
        slug: slugBase + '-' + String(serieIndex + 1).padStart(3, '0'),
        categoria: categoria,
        subcategoria: folderName,
        titulo: folderName
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase()) + ' #' + (serieIndex + 1),

        descripcion: "",
        tecnica: "",
        dimensiones: "",
        año: "",
        precio: "Consultar",

        // ⭐ Primera imagen de la serie (portada)
        imagenPrincipal: grupo[0].secure_url,

        // ⭐ TODAS las imágenes de esta serie
        imagenes: grupo.map(img => img.secure_url),

        imagenesData: grupo,
        destacada: serieIndex < 2  // Primeras 2 series destacadas
      });
    });
  });

  console.log("📊 SERIES GENERADAS:", obras.length);
  return obras;
}

// =====================================================
// CACHE
// =====================================================

var obrasCache = null;
var loadingPromise = null;

// =====================================================
// FETCH DESDE n8n
// =====================================================

export async function fetchObrasFromN8N() {
  if (obrasCache) return obrasCache;
  if (loadingPromise) return loadingPromise;

  loadingPromise = fetch(N8N_WEBHOOK_URL)
    .then(function(res) {
      if (!res.ok) {
        throw new Error('Error al cargar obras: ' + res.status);
      }
      return res.json();
    })
    .then(function(jsonData) {
      console.log("🔍 RESPUESTA COMPLETA DE n8n:", jsonData);  // ← AGREGA ESTO
      console.log("🔍 Keys:", Object.keys(jsonData));           // ← Y ESTO
      obrasCache = processObras(jsonData);
      console.log('📊 Obras cargadas:', obrasCache.length);
      return obrasCache;
    })
    .catch(function(err) {
      console.error('❌ Error:', err);
      loadingPromise = null;
      throw err;
    });

  return loadingPromise;
}
// =====================================================
// CONSULTAS
// =====================================================

export async function getObrasByCategoria(categoriaId) {
  var obras = await fetchObrasFromN8N();
  return obras.filter(function(o) {
    return o.categoria === categoriaId;
  });
}

export async function getObrasDestacadasByCategoria(categoriaId, limit) {
  if (limit === undefined) limit = 6;
  var obras = await fetchObrasFromN8N();
  return obras
    .filter(function(o) {
      return o.categoria === categoriaId && o.destacada;
    })
    .slice(0, limit);
}

export async function getObraBySlug(slug) {
  var obras = await fetchObrasFromN8N();
  return obras.find(function(o) {
    return o.slug === slug;
  });
}

export async function getObraById(id) {
  var obras = await fetchObrasFromN8N();
  return obras.find(function(o) {
    return o.id === parseInt(id);
  });
}

export async function getAllObras() {
  return await fetchObrasFromN8N();
}

export async function getEstadisticas() {
  var obras = await fetchObrasFromN8N();
  var stats = {};
  obras.forEach(function(o) {
    stats[o.categoria] = (stats[o.categoria] || 0) + 1;
  });
  return stats;
}

export function clearObrasCache() {
  obrasCache = null;
  loadingPromise = null;
  console.log('🔄 Cache limpiado');
}