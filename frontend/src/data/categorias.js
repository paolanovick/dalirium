// =====================================================
// CATEGORIAS.JS — Dalirium
// =====================================================

export const categorias = [
   {
    id: "cuadros",
    nombre: "Cuadros",
    descripcion: "Pinturas y obras enmarcadas",
    path: "/categoria/cuadros"
  },
   {
    id: "esculturas",
    nombre: "Esculturas",
    descripcion: "Esculturas y piezas tridimensionales",
    path: "/categoria/esculturas"
  },
  {
    id: "relojes",
    nombre: "Relojes",
    descripcion: "Relojes artísticos y objetos de tiempo surrealista",
    path: "/categoria/relojes"
  },
   {
    id: "medallas-olimpicas",
    nombre: "Medallas Olímpicas",
    descripcion: "Medallas y piezas conmemorativas",
    path: "/categoria/medallas-olimpicas"
  },
  
 
  {
    id: "juegos-olimpicos",
    nombre: "Juegos Olímpicos",
    descripcion: "Obras vinculadas al universo olímpico",
    path: "/categoria/juegos-olimpicos"
  },
  {
    id: "litografias",
    nombre: "Litografías",
    descripcion: "Obra gráfica y litografías originales",
    path: "/categoria/litografias"
  },
 
  {
    id: "cuadros-chicos",
    nombre: "Cuadros pequeños",
    descripcion: "Formatos pequeños y piezas íntimas",
    path: "/categoria/cuadros-chicos"
  },
 
  
  {
    id: "vajilla",
    nombre: "Vajilla",
    descripcion: "Objetos utilitarios y piezas de diseño",
    path: "/categoria/vajilla"
  },
  {
    id: "fotos-textos",
    nombre: "Fotos y textos",
    descripcion: "Material gráfico, textos y fotografías",
    path: "/categoria/fotos-textos"
  },
  {
    id: "daga",
    nombre: "Daga",
    descripcion: "Pieza especial y objeto singular",
    path: "/categoria/daga"
  },
  {
    id: "certificados",
    nombre: "Certificados",
    descripcion: "Certificados y documentación de obra",
    path: "/categoria/certificados"
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
export const WHATSAPP_NUMBER = "37668355";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

