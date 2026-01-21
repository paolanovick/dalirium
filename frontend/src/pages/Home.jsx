import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ScrollGallery from "../components/ScrollGallery";


const Home = () => {
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Animación de carrusel infinito
    if (!carouselRef.current) return;

    let scrollPos = 0;
    const speed = 0.5;

    const animateCarousel = () => {
      scrollPos -= speed;

      if (carouselRef.current) {
        carouselRef.current.style.transform = `translateX(${scrollPos}px)`;

        if (Math.abs(scrollPos) >= carouselRef.current.scrollWidth / 2) {
          scrollPos = 0;
        }
      }

      requestAnimationFrame(animateCarousel);
    };

    animateCarousel();
  }, []);

  const handleIngresar = () => {
    navigate("/colecciones");
  };

  return (
    <MainLayout>
      {/* HERO CON CARRUSEL - RESPONSIVE */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        {/* CARRUSEL DEL TÍTULO */}
        <div className="relative z-20 w-full overflow-hidden mb-12 pt-12 lg:pt-20 pb-8">
          <div
            ref={carouselRef}
            className="flex gap-16 md:gap-32 whitespace-nowrap will-change-transform"
          >
            {[...Array(20)].map((_, i) => (
              <h1
                key={i}
                className="font-dali text-[80px] sm:text-[120px] md:text-[160px] lg:text-[200px] leading-none text-white/90 select-none inline-block drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                style={{
                  textShadow: `
                    0 0 40px rgba(255, 255, 255, 0.3),
                    0 20px 60px rgba(0, 0, 0, 0.6),
                    0 -2px 20px rgba(255, 255, 255, 0.2)
                  `,
                  WebkitTextStroke: "1px rgba(255, 255, 255, 0.1)",
                }}
              >
                Dalirium
              </h1>
            ))}
          </div>
        </div>

        {/* TEXTO */}
        <p className="font-serif text-white/70 text-sm sm:text-base md:text-lg max-w-2xl text-center leading-relaxed tracking-wide px-4 sm:px-8">
          Un viaje onírico a través del delirio surrealista
        </p>
      </section>

      {/* SCROLL GALLERY */}
      <div className="-mt-20 md:-mt-40">
        <ScrollGallery />
      </div>

      {/* BOTÓN INGRESAR - RESPONSIVE */}
      <section className="py-12 md:py-20 flex justify-center px-4">
        <button
          onClick={handleIngresar}
          className="group relative px-8 sm:px-12 md:px-16 py-4 md:py-5 bg-transparent border-2 border-white/30 text-white font-bold text-xs sm:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-none hover:border-white/60 transition-all duration-500 overflow-hidden"
        >
          <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
          <span className="relative z-10 group-hover:text-black transition-colors duration-500">
            Ingresar
          </span>
          <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/60"></span>
          <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/60"></span>
          <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/60"></span>
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/60"></span>
        </button>
      </section>

      {/* SECCIÓN EDITORIAL - RESPONSIVE */}
      <section className="py-16 md:py-32 max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl md:text-2xl uppercase tracking-widest mb-4 md:mb-6 text-neutral-400">
          Colección
        </h2>

        <p className="text-neutral-300 leading-relaxed text-base md:text-lg">
          Cada pieza ha sido seleccionada por su valor artístico,
          simbólico y narrativo. El recorrido invita a observar,
          detenerse y descubrir nuevas capas en cada obra.
        </p>
      </section>
    </MainLayout>
  );
};

export default Home;
