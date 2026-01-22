import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

const CategoryCarousel = ({ 
  categoria, 
  obras = [], 
  showTitle = true,
  expandirImagenes = false
}) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  if (!obras.length) return null;

  // Preparar imágenes
  const items = expandirImagenes 
    ? obras.flatMap(obra => obra.imagenes.map((img, idx) => ({ ...obra, imagen: img, key: `${obra.id}-${idx}` })))
    : obras.map(obra => ({ ...obra, imagen: obra.imagenPrincipal, key: obra.id }));

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Fondo con degradado cálido */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-amber-950/20 to-stone-950 opacity-50" />
      
      {showTitle && (
        <div className="relative z-10 text-center mb-12 px-4">
          <span className="text-amber-500/80 text-sm font-medium tracking-[0.3em] uppercase">
            Colección
          </span>
          <h2 className="text-3xl md:text-5xl text-white font-light mt-3 mb-4 font-serif">
            {categoria.nombre}
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto" />
          <p className="text-white/40 text-sm mt-4 max-w-md mx-auto">
            {categoria.descripcion}
          </p>
        </div>
      )}

      <div className="relative z-10 pb-8">
        <Swiper
  modules={[Navigation, EffectCoverflow]}
  effect={items.length > 3 ? "coverflow" : "slide"}
  grabCursor={true}
  centeredSlides={true}
  slidesPerView={items.length < 3 ? items.length : 1.2}
  spaceBetween={20}
  loop={items.length > 4}
  coverflowEffect={{
    rotate: 0,
    stretch: 0,
    depth: 100,
    modifier: 2,
    slideShadows: false,
  }}
  navigation={{
    prevEl: `.prev-${categoria.id}`,
    nextEl: `.next-${categoria.id}`,
  }}
  onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
  breakpoints={{
    640: { slidesPerView: items.length < 3 ? items.length : 2.2, spaceBetween: 30 },
    1024: { slidesPerView: items.length < 4 ? items.length : 3.2, spaceBetween: 40 },
    1280: { slidesPerView: items.length < 5 ? items.length : 4, spaceBetween: 50 },
  }}
  className="!overflow-visible"
>
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            
            return (
              <SwiperSlide key={item.key}>
                <div
                  onClick={() => navigate(`/obra/${item.slug}`)}
                  className={`relative cursor-pointer transition-all duration-700 ease-out ${
                    isActive 
                      ? "scale-105 z-20" 
                      : "scale-90 opacity-60 z-10"
                  }`}
                >
                  {/* Marco dorado */}
                  <div className={`absolute -inset-2 md:-inset-3 rounded-sm transition-all duration-700 ${
                    isActive 
                      ? "bg-gradient-to-br from-amber-600/40 via-yellow-500/20 to-amber-700/40 shadow-[0_0_30px_rgba(217,119,6,0.3)]" 
                      : "bg-gradient-to-br from-amber-900/20 via-transparent to-amber-900/20"
                  }`} />
                  
                  {/* Contenedor de imagen */}
                  <div className="relative aspect-[3/4] w-[240px] md:w-[280px] lg:w-[320px] bg-stone-900 overflow-hidden">
                    {/* Borde interior dorado */}
                    <div className="absolute inset-0 border border-amber-500/30 z-10 pointer-events-none" />
                    
                    <img
                      src={item.imagen}
                      alt={item.titulo}
                      draggable={false}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                        isActive ? "scale-100" : "scale-110 blur-[1px]"
                      }`}
                    />

                    {/* Overlay con gradiente */}
                    <div className={`absolute inset-0 transition-opacity duration-500 ${
                      isActive 
                        ? "bg-gradient-to-t from-black/90 via-black/20 to-transparent" 
                        : "bg-black/40"
                    }`} />

                    {/* Info de la obra */}
                    <div className={`absolute bottom-0 left-0 right-0 p-5 transition-all duration-500 ${
                      isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}>
                      <div className="w-8 h-0.5 bg-amber-500/60 mb-3" />
                      <h3 className="text-white text-lg font-light line-clamp-1 font-serif">
                        {item.titulo}
                      </h3>
                      <p className="text-amber-200/50 text-xs uppercase tracking-wider mt-1">
                        {item.subcategoria}
                      </p>
                    </div>

                    {/* Esquinas decorativas (solo activa) */}
                    {isActive && (
                      <>
                        <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-amber-500/50" />
                        <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-amber-500/50" />
                        <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-amber-500/50" />
                        <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-amber-500/50" />
                      </>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Controles de navegación */}
        <div className="flex items-center justify-center gap-8 mt-10">
          <button className={`prev-${categoria.id} w-12 h-12 rounded-full border border-amber-500/40 hover:border-amber-500 hover:bg-amber-500/10 text-amber-500/60 hover:text-amber-500 transition-all flex items-center justify-center`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="text-amber-500/40 text-sm font-light">
            {activeIndex + 1} / {items.length}
          </span>

          <button className={`next-${categoria.id} w-12 h-12 rounded-full border border-amber-500/40 hover:border-amber-500 hover:bg-amber-500/10 text-amber-500/60 hover:text-amber-500 transition-all flex items-center justify-center`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Botón ver todo */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate(categoria.path)}
            className="inline-flex items-center gap-2 text-amber-500/60 hover:text-amber-500 text-sm uppercase tracking-widest transition-colors group"
          >
            Ver colección completa
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;