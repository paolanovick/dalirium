import { useState, useEffect, useRef } from "react";
import CategoryCarousel from "./CategoryCarousel";
import { getObrasByCategoria } from "../../data/obras";

const LazyCarousel = ({ categoria }) => {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  // Intersection Observer - detecta cuando el componente es visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Carga 200px antes de que sea visible
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  // Cargar obras solo cuando es visible
  useEffect(() => {
    if (!isVisible) return;

    getObrasByCategoria(categoria.id)
      .then((data) => {
        setObras(data.slice(0, 6)); // Máximo 6 obras
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [isVisible, categoria.id]);

  return (
    <div ref={ref} className="min-h-[400px]">
      {!isVisible || loading ? (
        // Placeholder mientras carga
        <div className="py-16 md:py-24">
          <div className="text-center mb-12 px-4">
            <span className="text-amber-500/80 text-sm font-medium tracking-[0.3em] uppercase">
              Colección
            </span>
            <h2 className="text-3xl md:text-5xl text-white font-light mt-3 mb-4 font-serif">
              {categoria.nombre}
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto" />
          </div>
          <div className="flex justify-center">
            <div className="w-12 h-12 border-2 border-white/20 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        </div>
      ) : obras.length > 0 ? (
        <CategoryCarousel categoria={categoria} obras={obras} />
      ) : null}
    </div>
  );
};

export default LazyCarousel;