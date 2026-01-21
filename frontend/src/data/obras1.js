// // =====================================================
// // OBRAS.JS - n8n + Cloudinary (Dalirium)
// // =====================================================

// const N8N_WEBHOOK_URL = "https://n8n.triptest.com.ar/webhook/dalirium";

// const CLOUDINARY_BASE =
//   "https://res.cloudinary.com/dwz6kggqe/image/upload";

// // =====================================================
// // MAPEO DE CATEGORÍAS (Cloudinary folders)
// // =====================================================

// const categoryMapping = {
//   "relojes": "relojes",
//   // "medallas-olimpicas": "medallas-olimpicas",
//   "juegos-olimpicos": "juegos-olimpicos",
//   "litografias": "litografias",
//   "fotos-textos": "fotos-textos",
//   "esculturas": "esculturas",
//   "daga": "daga",
//   "cuadros": "cuadros",
//   "cuadros-chicos": "cuadros",
//   "vajilla": "vajilla",
//   "certificados": "certificados"
// };

// // =====================================================
// // UTILIDADES
// // =====================================================

// function extractNumber(name) {
//   const match = name.match(/(\d+)/);
//   return match ? parseInt(match[1], 10) : 0;
// }

// function generateSlug(base, index) {
//   return `${base}-${String(index + 1).padStart(3, "0")}`;
// }

// function generateTitle(base, index) {
//   return (
//     base
//       .replace(/-/g, " ")
//       .replace(/\b\w/g, (l) => l.toUpperCase()) +
//     " #" +
//     (index + 1)
//   );
// }

// function groupConsecutiveImages(images, maxGap = 3) {
//   if (!images || images.length === 0) return [];

//   const sorted = images.slice().sort((a, b) => {
//     return extractNumber(a.nombre) - extractNumber(b.nombre);
//   });

//   const groups = [];
//   let current = [sorted[0]];

//   for (let i = 1; i < sorted.length; i++) {
//     const gap =
//       extractNumber(sorted[i].nombre) -
//       extractNumber(sorted[i - 1].nombre);

//     if (gap > 0 && gap <= maxGap) {
//       current.push(sorted[i]);
//     } else {
//       groups.push(current);
//       current = [sorted[i]];
//     }
//   }

//   groups.push(current);
//   return groups;
// }

// // =====================================================
// // PROCESAMIENTO PRINCIPAL
// // =====================================================

// function processObras(jsonData) {
//   const obras = [];
//   let globalId = 1;

//   Object.keys(jsonData).forEach((folderPath) => {
//     const imagenes = jsonData[folderPath];

//     // ej: "dalirium/relojes" → "relojes"
//     const parts = folderPath.split("/");
//     const categoriaKey = parts[parts.length - 1].toLowerCase();

//     const categoria =
//       categoryMapping[categoriaKey] || "coleccion-privada";

//     const grupos = groupConsecutiveImages(imagenes);

//     grupos.forEach((grupo, index) => {
//         console.log("PUBLIC:", grupo[0].public_id);
//       obras.push({
//         id: globalId++,
//         slug: generateSlug(categoriaKey, index),
//         categoria,
//         subcategoria: categoriaKey,
//         titulo: generateTitle(categoriaKey, index),
//         descripcion: "",
//         tecnica: "",
//         dimensiones: "",
//         año: "",
//         precio: "Consultar",

//         // ✅ CLOUDINARY – USAR SOLO public_id
//         imagenPrincipal: `${CLOUDINARY_BASE}/f_auto,q_auto/${grupo[0].public_id}`,
//         imagenes: grupo.map(img =>
//           `${CLOUDINARY_BASE}/f_auto,q_auto/${img.public_id}`
//         ),

//         imagenesData: grupo,
//         destacada: index < 6
//       });
//     });
//   });

//   return obras;
// }


// // =====================================================
// // CACHE
// // =====================================================

// let obrasCache = null;
// let loadingPromise = null;

// // =====================================================
// // FETCH DESDE n8n
// // =====================================================

// export async function fetchObrasFromN8N() {
//   if (obrasCache) return obrasCache;
//   if (loadingPromise) return loadingPromise;

//   loadingPromise = fetch(N8N_WEBHOOK_URL)
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error("Error al cargar obras: " + res.status);
//       }
//       return res.json();
//     })
//     .then((jsonData) => {
//       obrasCache = processObras(jsonData);
//       console.log("📊 Obras cargadas:", obrasCache.length);
//       return obrasCache;
//     })
//     .catch((err) => {
//       loadingPromise = null;
//       throw err;
//     });

//   return loadingPromise;
// }

// // =====================================================
// // CONSULTAS
// // =====================================================

// export async function getObrasByCategoria(categoriaId) {
//   const obras = await fetchObrasFromN8N();
//   return obras.filter((o) => o.categoria === categoriaId);
// }

// export async function getObrasDestacadasByCategoria(
//   categoriaId,
//   limit = 6
// ) {
//   const obras = await fetchObrasFromN8N();
//   return obras
//     .filter(
//       (o) => o.categoria === categoriaId && o.destacada
//     )
//     .slice(0, limit);
// }

// export async function getObraBySlug(slug) {
//   const obras = await fetchObrasFromN8N();
//   return obras.find((o) => o.slug === slug);
// }

// export async function getObraById(id) {
//   const obras = await fetchObrasFromN8N();
//   return obras.find((o) => o.id === parseInt(id));
// }

// export async function getAllObras() {
//   return await fetchObrasFromN8N();
// }

// export async function getEstadisticas() {
//   const obras = await fetchObrasFromN8N();
//   return obras.reduce((acc, o) => {
//     acc[o.categoria] = (acc[o.categoria] || 0) + 1;
//     return acc;
//   }, {});
// }

// export function clearObrasCache() {
//   obrasCache = null;
//   loadingPromise = null;
//   console.log("🔄 Cache limpiado");
// }
