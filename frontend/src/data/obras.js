// =====================================================
// OBRAS.JS - Cloudinary + n8n (Dalirium)
// =====================================================


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
  "litografías": "litografias",
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

// Extraer timestamp completo (fecha + hora) como número para comparar
// Formato: 20240829_161344_xxx -> extraemos 20240829161344
function extractTimestamp(name) {
  if (!name || typeof name !== "string") return 0;
  const match = name.match(/(\d{8})_(\d{6})/);
  if (match) {
    return parseInt(match[1] + match[2], 10);
  }
  return 0;
}

// Convertir timestamp a segundos para calcular diferencia de tiempo
function timestampToSeconds(ts) {
  const str = ts.toString();
  if (str.length < 14) return 0;
  const hours = parseInt(str.slice(8, 10), 10);
  const minutes = parseInt(str.slice(10, 12), 10);
  const seconds = parseInt(str.slice(12, 14), 10);
  return hours * 3600 + minutes * 60 + seconds;
}

// Agrupar imágenes tomadas dentro de X segundos como una misma obra
function groupConsecutiveImages(images, maxGapSeconds) {
  if (maxGapSeconds === undefined) maxGapSeconds = 60; // 1 minuto por defecto
  if (!images || images.length === 0) return [];

  // Ordenar por timestamp completo (fecha + hora)
  var sorted = images.slice().sort(function(a, b) {
    return extractTimestamp(a.public_id) - extractTimestamp(b.public_id);
  });

  var groups = [];
  var current = [sorted[0]];

  for (var i = 1; i < sorted.length; i++) {
    var lastTs = extractTimestamp(sorted[i - 1].public_id);
    var currentTs = extractTimestamp(sorted[i].public_id);
    
    // Extraer fecha (YYYYMMDD) y hora (HHMMSS) por separado
    var lastDate = Math.floor(lastTs / 1000000);
    var currentDate = Math.floor(currentTs / 1000000);
    
    // Si son de días diferentes, es otra obra
    if (lastDate !== currentDate) {
      groups.push(current);
      current = [sorted[i]];
      continue;
    }
    
    // Mismo día: calcular diferencia en segundos
    var lastSeconds = timestampToSeconds(lastTs);
    var currentSeconds = timestampToSeconds(currentTs);
    var gap = currentSeconds - lastSeconds;

    // Si están dentro del rango de tiempo, misma obra
    if (gap >= 0 && gap <= maxGapSeconds) {
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
  Object.keys(imagesByFolder).forEach(function(folderName) {
    var imagenes = imagesByFolder[folderName];

    // 🔑 DEDUPLICAR por public_id (eliminar duplicados)
    var visto = {};
    imagenes = imagenes.filter(function(img) {
      var id = img.public_id;
      if (visto[id]) return false;
      visto[id] = true;
      return true;
    });

    var categoriaKey = folderName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

    var categoria = categoryMapping[categoriaKey] || "coleccion-privada";
    
    // 🔑 Agrupar imágenes por tiempo (120 seg = 2 min)
    var series = groupConsecutiveImages(imagenes, 120);
    
    console.log("📁", folderName, "- Imágenes:", imagenes.length, "- Obras:", series.length);

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
        destacada: serieIndex < 2
      });
    });
  });

  console.log("📊 TOTAL OBRAS GENERADAS:", obras.length);
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
      console.log("🔍 RESPUESTA DE n8n:", Object.keys(jsonData));
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