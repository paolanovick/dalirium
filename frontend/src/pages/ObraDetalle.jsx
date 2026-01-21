import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";
import { getObraBySlug, getObrasByCategoria } from "../data/obras";
import { getCategoriaById, WHATSAPP_NUMBER } from "../data/categorias";

const ObraDetalle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [obra, setObra] = useState(null);
  const [obrasRelacionadas, setObrasRelacionadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const cargarObra = useCallback(async () => {
    try {
      const data = await getObraBySlug(slug);
      setObra(data);
      setImagenActiva(0);
      
      if (data) {
        const relacionadas = await getObrasByCategoria(data.categoria);
        const filtradas = (relacionadas || [])
          .filter((o) => o.slug !== slug)
          .slice(0, 4);
        setObrasRelacionadas(filtradas);
      }
    } catch (err) {
      console.error("Error cargando obra:", err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    cargarObra();
  }, [cargarObra]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/50">Cargando obra...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!obra) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl text-white mb-4">Obra no encontrada</h1>
            <button 
              onClick={() => navigate('/colecciones')}
              className="text-white/60 hover:text-white underline"
            >
              Volver a colecciones
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const categoria = getCategoriaById(obra.categoria);
  const imagenes = obra.imagenes || [obra.imagenPrincipal];

  const mensajeWhatsApp = encodeURIComponent(
    `Hola! Me interesa consultar sobre la obra "${obra.titulo}" (${obra.subcategoria}). ¿Podrían darme más información?`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensajeWhatsApp}`;

  return (
    <MainLayout>
      <section className="pt-28 md:pt-36 pb-4 px-4 md:px-8 lg:px-16">
        <nav className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-white/40">
          <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
          <span>/</span>
          <Link to="/colecciones" className="hover:text-white transition-colors">Colecciones</Link>
          <span>/</span>
          {categoria && (
            <>
              <Link to={categoria.path} className="hover:text-white transition-colors">
                {categoria.nombre}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-white/70 line-clamp-1">{obra.titulo}</span>
        </nav>
      </section>

      <section className="px-4 md:px-8 lg:px-16 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            <div className="space-y-4">
  {/* Imagen principal */}
  <div
    className="relative aspect-square bg-zinc-800 overflow-hidden cursor-zoom-in"
    onClick={() => setLightboxOpen(true)}
  >
    <img
      src={imagenes[imagenActiva]}
      alt={`${obra.titulo} - Imagen ${imagenActiva + 1}`}
      className="w-full h-full object-contain"
    />
  </div>

  {/* Carrusel de miniaturas (estilo Mercado Libre) */}
  {imagenes.length > 1 && (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {imagenes.map((img, index) => (
          <button
            key={index}
            onClick={() => setImagenActiva(index)}
            className={`flex-shrink-0 w-20 h-20 border transition-all duration-200 ${
              index === imagenActiva
                ? "border-white"
                : "border-white/20 hover:border-white/50"
            }`}
          >
            <img
              src={img}
              alt={`Miniatura ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )}
</div>

            <div className="lg:sticky lg:top-32 lg:self-start space-y-6">
              <p className="text-white/40 text-xs uppercase tracking-wider">
                {obra.subcategoria}
              </p>

              <h1 className="text-3xl md:text-4xl font-light text-white">
                {obra.titulo}
              </h1>

              <div className="py-4 border-y border-white/10">
                <p className="text-2xl text-white font-light">
                  {obra.precio || "Precio a consultar"}
                </p>
              </div>

              <div className="space-y-4">
                {obra.descripcion && (
                  <div>
                    <h3 className="text-white/40 text-xs uppercase tracking-wider mb-2">Descripción</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{obra.descripcion}</p>
                  </div>
                )}

                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/40 text-sm">Categoría</span>
                  <Link 
                    to={categoria?.path || '/colecciones'} 
                    className="text-white/80 text-sm hover:text-white transition-colors"
                  >
                    {categoria?.nombre || obra.categoria}
                  </Link>
                </div>

                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/40 text-sm">Fotos disponibles</span>
                  <span className="text-white/80 text-sm">{imagenes.length}</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-500 text-white font-medium transition-colors duration-300"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>Consultar por esta obra</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {obrasRelacionadas.length > 0 && (
        <section className="px-4 md:px-8 lg:px-16 py-16 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl md:text-2xl font-light text-white mb-8">
              Otras obras de {categoria?.nombre || 'esta categoría'}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {obrasRelacionadas.map((obraRel) => (
                <Link key={obraRel.id} to={`/obra/${obraRel.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800">
                    <img
                      src={obraRel.imagenPrincipal}
                      alt={obraRel.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
            onClick={() => setLightboxOpen(false)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <img
            src={imagenes[imagenActiva]}
            alt={obra.titulo}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {imagenes.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImagenActiva(prev => prev === 0 ? imagenes.length - 1 : prev - 1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImagenActiva(prev => prev === imagenes.length - 1 ? 0 : prev + 1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            {imagenActiva + 1} / {imagenes.length}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ObraDetalle;