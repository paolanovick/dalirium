// =====================================================
// CATEGORIAS.JS - Dalirium
// =====================================================

const API_URL = import.meta.env.VITE_API_URL || 'https://api.agenciatripnow.site/dalirium';

export const DEFAULT_CATEGORIAS = [
  {
    id: "gala-dali-dorado",
    slug: "gala-dali-dorado",
    nombre: "Gala Dalí Dorado",
    descripcion: "Colección Gala Dalí Dorado",
    path: "/categoria/gala-dali-dorado",
    orden: 10,
    visible: true,
    privada: false,
    imagenes: []
  },
  {
    id: "fotos-textos",
    slug: "fotos-textos",
    nombre: "Libros",
    descripcion: "Material gráfico, textos y fotografías",
    path: "/categoria/fotos-textos",
    orden: 20,
    visible: true,
    privada: false,
    imagenes: []
  },
  {
    id: "litografias",
    slug: "litografias",
    nombre: "Litografías",
    descripcion: "Obra gráfica y litografías originales",
    path: "/categoria/litografias",
    orden: 30,
    visible: true,
    privada: false,
    imagenes: []
  },
  {
    id: "medallas-olimpicas",
    slug: "medallas-olimpicas",
    nombre: "Medallas Olímpicas",
    descripcion: "Medallas y piezas conmemorativas",
    path: "/categoria/medallas-olimpicas",
    orden: 40,
    visible: true,
    privada: false,
    imagenes: []
  },
  {
    id: "vajilla",
    slug: "vajilla",
    nombre: "Vajilla",
    descripcion: "Objetos utilitarios y piezas de diseño",
    path: "/categoria/vajilla",
    orden: 50,
    visible: true,
    privada: false,
    imagenes: []
  },
  {
    id: "esculturas",
    slug: "esculturas",
    nombre: "Esculturas",
    descripcion: "Esculturas y piezas tridimensionales",
    path: "/categoria/esculturas",
    orden: 60,
    visible: true,
    privada: false,
    imagenes: []
  },
  {
    id: "gala-lincoln",
    slug: "gala-lincoln",
    nombre: "Gala Lincoln",
    descripcion: "Colección Gala Lincoln",
    path: "/categoria/gala-lincoln",
    orden: 70,
    visible: true,
    privada: false,
    imagenes: []
  },
  {
    id: "muro-de-los-lamentos",
    slug: "muro-de-los-lamentos",
    nombre: "Muro de los Lamentos",
    descripcion: "Colección Muro de los Lamentos",
    path: "/categoria/muro-de-los-lamentos",
    orden: 80,
    visible: true,
    privada: false,
    imagenes: []
  },
  {
    id: "obras-en-reserva",
    slug: "obras-en-reserva",
    nombre: "Obras en Reserva",
    descripcion: "Colección de obras disponibles bajo consulta",
    path: "/categoria/obras-en-reserva",
    orden: 90,
    visible: true,
    privada: false,
    imagenes: []
  },
  {
    id: "botellas",
    slug: "botellas",
    nombre: "Botellas",
    descripcion: "Botellas y piezas únicas",
    path: "/categoria/botellas",
    orden: 100,
    visible: true,
    privada: false,
    imagenes: []
  },
  {
    id: "coleccion-privada",
    slug: "coleccion-privada",
    nombre: "Colección Privada",
    descripcion: "Colección privada",
    path: "/coleccion-privada",
    orden: 1000,
    visible: false,
    privada: true,
    imagenes: []
  }
];

export const categorias = DEFAULT_CATEGORIAS.filter((cat) => cat.visible && !cat.privada);

const categoriasCache = new Map();

export const normalizeCategoria = (categoria) => {
  const slug = categoria.slug || categoria.id;

  return {
    ...categoria,
    id: slug,
    slug,
    path: categoria.path || `/categoria/${slug}`,
    descripcion: categoria.descripcion || '',
    imagenes: Array.isArray(categoria.imagenes) ? categoria.imagenes.filter(Boolean) : [],
    imagenPrincipal: categoria.imagenPrincipal || categoria.imagenes?.[0] || '',
    orden: categoria.orden ?? 999,
    visible: categoria.visible ?? true,
    privada: categoria.privada ?? false
  };
};

export async function fetchCategorias({ admin = false, apiUrl = API_URL } = {}) {
  const cacheKey = `${apiUrl}:${admin ? 'admin' : 'public'}`;

  if (categoriasCache.has(cacheKey)) {
    return categoriasCache.get(cacheKey);
  }

  const query = admin ? '?admin=true' : '';
  const promise = fetch(`${apiUrl}/api/categorias${query}`)
    .then((res) => {
      if (!res.ok) throw new Error('No se pudieron cargar las categorias');
      return res.json();
    })
    .then((data) => data.map(normalizeCategoria))
    .catch(() => {
      const fallback = admin ? DEFAULT_CATEGORIAS : categorias;
      return fallback.map(normalizeCategoria);
    });

  categoriasCache.set(cacheKey, promise);
  return promise;
}

export async function fetchCategoriaById(id, options = {}) {
  const data = await fetchCategorias(options);
  return data.find((cat) => cat.id === id || cat.slug === id);
}

// =====================================================
// HELPERS (opcionales, pero útiles)
// =====================================================

export const getCategoriaById = (id) =>
  categorias.find((cat) => cat.id === id);

export const getCategoriaByPath = (path) =>
  categorias.find((cat) => cat.path === path);

export const clearCategoriasCache = () => categoriasCache.clear();

// WhatsApp
export const WHATSAPP_NUMBER = "34687789792";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

