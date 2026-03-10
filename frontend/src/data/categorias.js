// =====================================================
// CATEGORIAS.JS — Dalirium
// =====================================================

export const categorias = [
  {
    id: "botellas",
    nombre: "Botellas",
    descripcion: "Botellas y piezas únicas",
    path: "/categoria/botellas"
  },
  {
    id: "gala-dali-dorado",
    nombre: "Gala Dalí Dorado",
    descripcion: "Colección Gala Dalí Dorado",
    path: "/categoria/gala-dali-dorado"
  },
  {
    id: "fotos-textos",
    nombre: "Libros",
    descripcion: "Material gráfico, textos y fotografías",
    path: "/categoria/fotos-textos"
  },
  {
    id: "litografias",
    nombre: "Litografías",
    descripcion: "Obra gráfica y litografías originales",
    path: "/categoria/litografias"
  },
  {
    id: "medallas-olimpicas",
    nombre: "Medallas Olímpicas",
    descripcion: "Medallas y piezas conmemorativas",
    path: "/categoria/medallas-olimpicas"
  },
  {
    id: "vajilla",
    nombre: "Vajilla",
    descripcion: "Objetos utilitarios y piezas de diseño",
    path: "/categoria/vajilla"
  },
  {
    id: "esculturas",
    nombre: "Esculturas",
    descripcion: "Esculturas y piezas tridimensionales",
    path: "/categoria/esculturas"
  },
  {
    id: "gala-lincoln",
    nombre: "Gala Lincoln",
    descripcion: "Colección Gala Lincoln",
    path: "/categoria/gala-lincoln"
  },
  {
    id: "muro-de-los-lamentos",
    nombre: "Muro de los Lamentos",
    descripcion: "Colección Muro de los Lamentos",
    path: "/categoria/muro-de-los-lamentos"
  }
];

// =====================================================
// HELPERS (opcionales, pero útiles)
// =====================================================

export const getCategoriaById = (id) =>
  categorias.find((cat) => cat.id === id);

export const getCategoriaByPath = (path) =>
  categorias.find((cat) => cat.path === path);

// WhatsApp
export const WHATSAPP_NUMBER = "34687789792";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

