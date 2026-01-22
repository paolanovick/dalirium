// =====================================================
// OBRAS.JS - HÍBRIDO: MongoDB + n8n (Dalirium)
// =====================================================
// - Si la obra fue editada en admin → usa MongoDB
// - Si la obra NO fue editada → usa n8n
// =====================================================

const API_URL = import.meta.env.VITE_API_URL || 'https://api.agenciatripnow.site/dalirium';
const N8N_WEBHOOK_URL = "https://n8n.triptest.com.ar/webhook/dalirium";
const CLOUDINARY_BASE = 'https://res.cloudinary.com/dwz6kggqe/image/upload';

// =====================================================
// MAPEO DE CATEGORÍAS (para n8n)
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
// UTILIDADES PARA N8N
// =====================================================

function extractTimestamp(name) {
  if (!name || typeof name !== "string") return 0;
  const match = name.match(/(\d{8})_(\d{6})/);
  if (match) {
    return parseInt(match[1] + match[2], 10);
  }
  return 0;
}

function timestampToSeconds(ts) {
  const str = ts.toString();
  if (str.length < 14) return 0;
  const hours = parseInt(str.slice(8, 10), 10);
  const minutes = parseInt(str.slice(10, 12), 10);
  const seconds = parseInt(str.slice(12, 14), 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function groupConsecutiveImages(images, maxGapSeconds = 30) {
  if (!images || images.length === 0) return [];

  const sorted = images.slice().sort((a, b) => 
    extractTimestamp(a.public_id) - extractTimestamp(b.public_id)
  );

  const groups = [];
  let current = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const lastTs = extractTimestamp(sorted[i - 1].public_id);
    const currentTs = extractTimestamp(sorted[i].public_id);
    
    const lastDate = Math.floor(lastTs / 1000000);
    const currentDate = Math.floor(currentTs / 1000000);
    
    if (lastDate !== currentDate) {
      groups.push(current);
      current = [sorted[i]];
      continue;
    }
    
    const lastSeconds = timestampToSeconds(lastTs);
    const currentSeconds = timestampToSeconds(currentTs);
    const gap = currentSeconds - lastSeconds;

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
// PROCESAR DATOS DE N8N
// =====================================================

function processObrasFromN8N(jsonData) {
  const obras = [];
  let globalId = 1;
  const imagesByFolder = {};

  Object.keys(jsonData).forEach(key => {
    const responses = jsonData[key];
    responses.forEach(res => {
      if (res.resources && Array.isArray(res.resources)) {
        res.resources.forEach(img => {
          const folder = img.asset_folder || "sin-carpeta";
          const folderName = folder.split("/").pop();

          if (!imagesByFolder[folderName]) {
            imagesByFolder[folderName] = [];
          }
          imagesByFolder[folderName].push(img);
        });
      }
    });
  });

  Object.keys(imagesByFolder).forEach(folderName => {
    let imagenes = imagesByFolder[folderName];

    // Deduplicar
    const visto = {};
    imagenes = imagenes.filter(img => {
      const id = img.public_id;
      if (visto[id]) return false;
      visto[id] = true;
      return true;
    });

    const categoriaKey = folderName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

    const categoria = categoryMapping[categoriaKey] || "coleccion-privada";
    const series = groupConsecutiveImages(imagenes, 120);

    series.forEach((grupo, serieIndex) => {
      const slugBase = folderName.toLowerCase().replace(/\s+/g, '-');
      
      obras.push({
        id: `n8n-${globalId++}`,
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
        imagenPrincipal: grupo[0].secure_url,
        imagenes: grupo.map(img => img.secure_url),
        destacada: serieIndex < 2,
        orden: 999,
        source: 'n8n'
      });
    });
  });

  return obras;
}

// =====================================================
// PROCESAR DATOS DE MONGODB
// =====================================================

function processObrasFromMongo(data) {
  return data.map(obra => ({
    id: obra._id,
    slug: obra.slug,
    categoria: obra.categoria,
    subcategoria: obra.subcategoria || obra.categoria,
    titulo: obra.titulo,
    descripcion: obra.descripcion || '',
    tecnica: obra.tecnica || '',
    dimensiones: obra.dimensiones || '',
    año: obra.año || '',
    precio: obra.precio || 'Consultar',
    imagenPrincipal: obra.imagenPrincipal.startsWith('http') 
      ? obra.imagenPrincipal 
      : `${CLOUDINARY_BASE}/${obra.imagenPrincipal}`,
    imagenes: (obra.imagenes || []).map(img => 
      img.startsWith('http') ? img : `${CLOUDINARY_BASE}/${img}`
    ),
    destacada: obra.destacada || false,
    orden: obra.orden || 999,
    source: 'mongodb'
  }));
}

// =====================================================
// CACHE
// =====================================================

let obrasCache = null;
let loadingPromise = null;

// =====================================================
// FETCH COMBINADO
// =====================================================

export async function fetchAllObras() {
  if (obrasCache) return obrasCache;
  if (loadingPromise) return loadingPromise;

  loadingPromise = Promise.all([
    // Cargar de MongoDB
    fetch(`${API_URL}/api/obras`)
      .then(res => res.ok ? res.json() : [])
      .catch(() => []),
    // Cargar de n8n
    fetch(N8N_WEBHOOK_URL)
      .then(res => res.ok ? res.json() : {})
      .catch(() => ({}))
  ])
  .then(([mongoData, n8nData]) => {
    const mongoObras = processObrasFromMongo(mongoData);
    const n8nObras = processObrasFromN8N(n8nData);
    
    console.log('📊 Obras de MongoDB:', mongoObras.length);
    console.log('📊 Obras de n8n:', n8nObras.length);

    // Crear set de categorías que ya tienen obras en MongoDB
    const mongoCategories = new Set(mongoObras.map(o => o.categoria));
    
    // Filtrar n8n: solo incluir categorías que NO están en MongoDB
    const n8nFiltered = n8nObras.filter(o => !mongoCategories.has(o.categoria));
    
    // Combinar: MongoDB tiene prioridad
    obrasCache = [...mongoObras, ...n8nFiltered];
    
    console.log('📊 Total obras combinadas:', obrasCache.length);
    return obrasCache;
  })
  .catch(err => {
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
  const obras = await fetchAllObras();
  return obras
    .filter(o => o.categoria === categoriaId)
    .sort((a, b) => a.orden - b.orden);
}

export async function getObrasDestacadasByCategoria(categoriaId, limit = 6) {
  const obras = await fetchAllObras();
  return obras
    .filter(o => o.categoria === categoriaId && o.destacada)
    .sort((a, b) => a.orden - b.orden)
    .slice(0, limit);
}

export async function getObraBySlug(slug) {
  const obras = await fetchAllObras();
  return obras.find(o => o.slug === slug);
}

export async function getObraById(id) {
  const obras = await fetchAllObras();
  return obras.find(o => o.id === id);
}

export async function getAllObras() {
  return await fetchAllObras();
}

export async function getEstadisticas() {
  const obras = await fetchAllObras();
  const stats = {};
  obras.forEach(o => {
    stats[o.categoria] = (stats[o.categoria] || 0) + 1;
  });
  return stats;
}

export function clearObrasCache() {
  obrasCache = null;
  loadingPromise = null;
  console.log('🔄 Cache limpiado');
}