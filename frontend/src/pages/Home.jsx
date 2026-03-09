import { useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ScrollGallery from "../components/ScrollGallery";


const Home = () => {
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!carouselRef.current) return;

    let scrollPos = 0;
    const speed = 0.5;
    let rafId;

    const animateCarousel = () => {
      scrollPos -= speed;

      if (carouselRef.current) {
        const half = carouselRef.current.scrollWidth / 2;
        if (Math.abs(scrollPos) >= half) {
          scrollPos = scrollPos + half;
        }
        carouselRef.current.style.transform = `translateX(${scrollPos}px)`;
      }

      rafId = requestAnimationFrame(animateCarousel);
    };

    rafId = requestAnimationFrame(animateCarousel);
    return () => cancelAnimationFrame(rafId);
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

      {/* COLECCIÓN PRIVADA */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto border border-white/10 p-8 md:p-12">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-4">Acceso exclusivo</p>
          <h2 className="text-2xl md:text-3xl text-white mb-4">Colección Privada</h2>
          <p className="text-white/50 leading-relaxed mb-8">
            Existe una selección de obras de acceso restringido, disponible únicamente para coleccionistas e interesados que soliciten acceso. Para conocer más, contactanos directamente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://wa.me/34687789792?text=Hola!%20Quisiera%20acceder%20a%20la%20colecci%C3%B3n%20privada%20de%20Dalirium."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white px-6 py-3 text-sm uppercase tracking-widest transition-colors duration-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Solicitar acceso
            </a>
            <Link
              to="/coleccion-privada"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 px-6 py-3 text-sm uppercase tracking-widest transition-colors duration-300"
            >
              🔒 Ya tengo código
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
