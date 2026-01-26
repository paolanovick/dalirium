import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { categorias } from "../../data/categorias";

const TopNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative group transition-colors duration-300 ${
                isActive ? "text-white" : "text-white/70 hover:text-white"
              }`
            }
          >
            <span className="text-[11px] uppercase tracking-wider font-medium">
              Inicio
            </span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-white/50 group-hover:w-full transition-all duration-500"></div>
          </NavLink>

          {/* DROPDOWN COLECCIONES */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 text-white/70 hover:text-white transition-colors duration-300"
            >
              <span className="text-[11px] uppercase tracking-wider font-medium">
                Colecciones
              </span>
              <svg
                className={`w-3 h-3 transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-black/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-2 z-50">
                <NavLink
                  to="/colecciones"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-amber-400 hover:bg-white/5 text-xs uppercase tracking-wider font-medium"
                >
                  Ver todas
                </NavLink>
                <div className="h-px bg-white/10 my-2" />
                {categorias.map((cat) => (
                  <NavLink
                    key={cat.id}
                    to={cat.path}
                    onClick={() => setDropdownOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
                        isActive
                          ? "text-white bg-white/10"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`
                    }
                  >
                    {cat.nombre}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <NavLink
            to="/coleccion-privada"
            className={({ isActive }) =>
              `relative group transition-colors duration-300 ${
                isActive ? "text-white" : "text-white/70 hover:text-white"
              }`
            }
          >
            <span className="text-[11px] uppercase tracking-wider font-medium">
              Colección Privada
            </span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-white/50 group-hover:w-full transition-all duration-500"></div>
          </NavLink>
        </nav>

        {/* BOTÓN HAMBURGUESA */}
        <button
          className="lg:hidden relative group"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="flex flex-col gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-6 h-0.5 bg-white/70 group-hover:bg-white transition-all duration-300 ${
                  menuOpen && i === 0 ? "rotate-45 translate-y-2" : ""
                } ${menuOpen && i === 1 ? "opacity-0" : ""} ${
                  menuOpen && i === 2 ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></div>
            ))}
          </div>
        </button>
      </div>

      {/* MENÚ MÓVIL */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl lg:hidden overflow-y-auto">
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>

          <div className="flex flex-col items-center justify-start pt-24 pb-12 gap-4 min-h-screen">
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-lg uppercase tracking-widest transition-colors ${
                  isActive ? "text-white" : "text-white/60"
                }`
              }
            >
              Inicio
            </NavLink>

            <NavLink
              to="/colecciones"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-lg uppercase tracking-widest transition-colors ${
                  isActive ? "text-amber-400" : "text-amber-400/60"
                }`
              }
            >
              Todas las colecciones
            </NavLink>

            <div className="w-32 h-px bg-white/20 my-4" />

            {categorias.map((cat) => (
              <NavLink
                key={cat.id}
                to={cat.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm uppercase tracking-widest transition-colors ${
                    isActive ? "text-white" : "text-white/50"
                  }`
                }
              >
                {cat.nombre}
              </NavLink>
            ))}

            <div className="w-32 h-px bg-white/20 my-4" />

            <NavLink
              to="/coleccion-privada"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-lg uppercase tracking-widest transition-colors ${
                  isActive ? "text-amber-400" : "text-amber-400/60"
                }`
              }
            >
              🔒 Colección Privada
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopNav;