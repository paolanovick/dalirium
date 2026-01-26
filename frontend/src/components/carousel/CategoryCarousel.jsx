import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Iconos simples
const ChevronLeft = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const CategoryCarousel = ({ 
  categoria, 
  obras = [], 
  showTitle = true,
  autoplay = false,
  delay = 4
}) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const autoplayRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  
  const total = obras.length;

  const goTo = useCallback((direction) => {
    setActiveIndex(current => {
      if (direction === 'next') return (current + 1) % total;
      return (current - 1 + total) % total;
    });
  }, [total]);

  const startAutoplay = useCallback(() => {
    if (autoplay && total > 1) {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      autoplayRef.current = setInterval(() => goTo('next'), delay * 1000);
    }
  }, [autoplay, delay, goTo, total]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  const getSlideStyle = (index) => {
    const diff = index - activeIndex;
    const normalizedDiff = ((diff + total) % total);
    
    if (normalizedDiff === 0) {
      return { transform: 'translateX(-50%) scale(1)', left: '50%', zIndex: 5, opacity: 1, filter: 'grayscale(0)' };
    }
    if (normalizedDiff === 1) {
      return { transform: 'translateX(20%) scale(0.7)', left: '50%', zIndex: 4, opacity: 0.7, filter: 'grayscale(0.8)' };
    }
    if (normalizedDiff === total - 1) {
      return { transform: 'translateX(-120%) scale(0.7)', left: '50%', zIndex: 4, opacity: 0.7, filter: 'grayscale(0.8)' };
    }
    if (normalizedDiff === 2) {
      return { transform: 'translateX(70%) scale(0.5)', left: '50%', zIndex: 3, opacity: 0.4, filter: 'grayscale(1)' };
    }
    if (normalizedDiff === total - 2) {
      return { transform: 'translateX(-170%) scale(0.5)', left: '50%', zIndex: 3, opacity: 0.4, filter: 'grayscale(1)' };
    }
    return { transform: 'translateX(-50%) scale(0.3)', left: '50%', zIndex: 1, opacity: 0, filter: 'grayscale(1)' };
  };

  const handleStart = (clientX) => {
    setIsDragging(true);
    setStartX(clientX);
    stopAutoplay();
  };

  const handleEnd = (clientX) => {
    if (!isDragging) return;
    const distance = clientX - startX;
    if (Math.abs(distance) > 50) {
      if (distance < 0) goTo('next');
      else goTo('prev');
    }
    setIsDragging(false);
    startAutoplay();
  };

  // Return null DESPUÉS de los hooks
  if (!obras.length) return null;

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950">
      {showTitle && (
        <div className="text-center mb-12 px-4">
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

      <div 
        className="relative h-[400px] md:h-[500px] max-w-5xl mx-auto select-none"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseUp={(e) => handleEnd(e.clientX)}
        onMouseLeave={(e) => isDragging && handleEnd(e.clientX)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
      >
        {obras.map((obra, index) => {
          const style = getSlideStyle(index);
          const isActive = index === activeIndex;
          
          return (
            <div
              key={obra.id}
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out cursor-pointer"
              style={{
                left: style.left,
                transform: `translateY(-50%) ${style.transform.replace('translateX(-50%) ', '')}`,
                zIndex: style.zIndex,
                opacity: style.opacity,
              }}
              onClick={() => isActive && navigate(`/obra/${obra.slug}`)}
            >
              <div className="relative">
                <img
                  src={obra.imagenPrincipal}
                  alt={obra.titulo}
                  draggable={false}
                  className="w-[250px] md:w-[320px] h-auto max-h-[350px] md:max-h-[420px] object-contain rounded-lg shadow-2xl transition-all duration-700"
                  style={{ filter: style.filter }}
                />
                
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-b-lg">
                    <h3 className="text-white text-lg font-light font-serif truncate">
                      {obra.titulo}
                    </h3>
                    <p className="text-amber-400/70 text-xs uppercase tracking-wider mt-1">
                      {categoria.nombre}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {total > 1 && (
          <>
            <button
              onClick={() => goTo('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={() => goTo('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}
      </div>

      <div className="text-center mt-8">
        <span className="text-amber-500/40 text-sm">
          {activeIndex + 1} / {total}
        </span>
        
        <div className="mt-4">
          <button
            onClick={() => navigate(categoria.path)}
            className="inline-flex items-center gap-2 text-amber-500/60 hover:text-amber-500 text-sm uppercase tracking-widest transition-colors"
          >
            Ver colección completa
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;