import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const TopNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "INICIO", path: "/" },
    { label: "CUADROS", path: "/categoria/cuadros" },
    { label: "ESCULTURAS", path: "/categoria/esculturas" },
    { label: "RELOJES", path: "/categoria/relojes" },
    { label: "MEDALLAS", path: "/categoria/medallas-olimpicas" },
    { label: "JUEGOS OLÍMPICOS", path: "/categoria/juegos-olimpicos" },
    { label: "LITOGRAFÍAS", path: "/categoria/litografias" },
    { label: "VAJILLA", path: "/categoria/vajilla" },
    { label: "COLECCIÓN PRIVADA", path: "/categoria/coleccion-privada" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/90 backdrop-blur-xl shadow-2xl shadow-black/30"
          : "bg-black/70 backdrop-blur-md"
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-6 py-3 flex items-center justify-between gap-8">
        {/* LOGO */}
        <NavLink to="/" className="flex-shrink-0 group cursor-pointer">
          <img
            src="/logoFN.png"
            alt="Dalirium Art Gallery"
            className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
          />
        </NavLink>

        {/* NAV DESKTOP */}
        <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
          {navItems.map(({ label, path }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `relative group transition-colors duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                }`
              }
            >
              <span className="text-[11px] uppercase tracking-wider font-medium">
                {label}
              </span>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-white/50 group-hover:w-full transition-all duration-500"></div>
            </NavLink>
          ))}
        </nav>

        {/* BOTÓN HAMBURGUESA (EL TUYO, SIN TOCAR) */}
        <button
          className="lg:hidden relative group"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="flex flex-col gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-6 h-0.5 bg-white/70 group-hover:bg-white transition-all duration-300"
              ></div>
            ))}
          </div>
        </button>
      </div>

      {/* 🔴 ESTO ES LO ÚNICO NUEVO */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 flex flex-col items-center justify-center gap-8 lg:hidden">
          <button
            className="absolute top-6 right-6 text-white text-3xl"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>

          {navItems.map(({ label, path }) => (
            <NavLink
              key={label}
              to={path}
              onClick={() => setMenuOpen(false)}
              className="text-white text-xl uppercase tracking-widest"
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};

export default TopNav;
