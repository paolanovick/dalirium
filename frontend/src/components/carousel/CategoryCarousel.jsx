import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CategoryCarousel = ({ 
  categoria, 
  obras = [], 
  showTitle = true,
  expandirImagenes = false
}) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    handleScroll();
    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [obras]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "left" ? -el.clientWidth * 0.8 : el.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startX.current = e.pageX;
    startScrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const walk = (e.pageX - startX.current) * 1.2;
    scrollRef.current.scrollLeft = startScrollLeft.current - walk;
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  if (!obras.length) return null;

  return (
    <section className="relative py-12 md:py-20">
      {showTitle && (
  <div className="flex items-end justify-between mb-8 px-4 md:px-8 lg:px-16">
    <div>
      <h2 className="text-2xl md:text-4xl text-white font-light">
        {categoria.nombre}
      </h2>
      <p className="text-white/40 text-sm mt-2 hidden md:block">
        {categoria.descripcion}
      </p>
    </div>
    
    <button
      onClick={() => navigate(categoria.path)}
      className="text-white/60 hover:text-white text-sm uppercase tracking-wider"
    >
      Ver todo →
    </button>
  </div>
)}

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-20
          w-10 h-10 rounded-full bg-black/60 text-white
          ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          ‹
        </button>

        <button
          onClick={() => scroll("right")}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-20
          w-10 h-10 rounded-full bg-black/60 text-white
          ${canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          ›
        </button>

        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          className={`flex gap-6 overflow-x-auto px-4 md:px-8 lg:px-16 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{ scrollbarWidth: "none" }}
        >
          {obras.map((obra) => {
            // Si expandirImagenes es true, mostrar TODAS las imágenes
            const imagenesAMostrar = expandirImagenes 
              ? obra.imagenes 
              : [obra.imagenPrincipal];

            return imagenesAMostrar.map((img, idx) => (
              <div
                key={`${obra.id}-${idx}`}
                onClick={() => !isDragging && navigate(`/obra/${obra.slug}`)}
                className="flex-shrink-0 cursor-pointer"
              >
                <div className="relative w-[260px] md:w-[300px] lg:w-[340px] aspect-[3/4] bg-zinc-800 overflow-hidden">
                  <img
                    src={img}
                    alt={obra.titulo}
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white text-lg font-light line-clamp-1">
                      {obra.titulo}
                    </h3>
                    <p className="text-white/50 text-xs uppercase">
                      {obra.subcategoria}
                    </p>
                  </div>
                </div>
              </div>
            ));
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;