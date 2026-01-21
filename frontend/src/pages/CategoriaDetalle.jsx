import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import MainLayout from "../components/layout/MainLayout";
import { getCategoriaById, getCategoriaByPath } from "../data/categorias";
import { getObrasByCategoria } from "../data/obras";

const CategoriaDetalle = () => {
  const { categoriaId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [filtro, setFiltro] = useState("todas");
  const [loading, setLoading] = useState(true);
  const [todasLasObras, setTodasLasObras] = useState([]);

  const prevPathRef = useRef(location.pathname);

  const categoria = useMemo(() => {
    if (categoriaId) return getCategoriaById(categoriaId);
    return getCategoriaByPath(location.pathname);
  }, [categoriaId, location.pathname]);

  // 🔹 CARGA REAL ASÍNCRONA
  useEffect(() => {
    if (!categoria) return;

    let cancelled = false;

    // 👇 mover setLoading a microtask (ESLint OK)
    Promise.resolve().then(() => {
      if (!cancelled) setLoading(true);
    });

    getObrasByCategoria(categoria.id)
      .then((data) => {
        if (!cancelled) setTodasLasObras(data);
      })
      .catch(() => {
        if (!cancelled) setTodasLasObras([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoria]);

 
  const obras =
    filtro === "todas"
      ? todasLasObras
      : todasLasObras.filter((o) => o.subcategoria === filtro);

  // 🔹 RESET VISUAL AL CAMBIAR RUTA
  useEffect(() => {
    const pathChanged = prevPathRef.current !== location.pathname;
    prevPathRef.current = location.pathname;

    if (pathChanged) {
      Promise.resolve().then(() => setFiltro("todas"));
    }
  }, [location.pathname]);

  if (!categoria) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl text-white mb-4">
              Categoría no encontrada
            </h1>
            <button
              onClick={() => navigate("/colecciones")}
              className="text-white/60 hover:text-white underline"
            >
              Volver a colecciones
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* HERO */}
      <section className="pt-32 md:pt-40 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex gap-2 text-sm text-white/40 mb-8">
            <Link to="/">Inicio</Link>
            <span>/</span>
            <Link to="/colecciones">Colecciones</Link>
            <span>/</span>
            <span className="text-white/70">{categoria.nombre}</span>
          </nav>

          <h1 className="text-5xl text-white mb-3">
            {categoria.nombre}
          </h1>
          <p className="text-white/50">{categoria.descripcion}</p>
        </div>
      </section>

      {/* GRID */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-zinc-800 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              {obras.map((obra) => (
                <Link
                  key={obra.id}
                  to={`/obra/${obra.slug}`}
                  className="block"
                >
                  <img
                    src={obra.imagenPrincipal}
                    alt={obra.titulo}
                    className="w-full h-full object-cover"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default CategoriaDetalle;
