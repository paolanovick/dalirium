import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import CategoryCarousel from "../components/carousel/CategoryCarousel";
import { categorias } from "../data/categorias";
import { getAllObras } from "../data/obras";

const Colecciones = () => {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllObras()
      .then((data) => {
        setObras(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <MainLayout>
      <section className="pt-32 md:pt-40 pb-12 px-4 text-center">
        <h1 className="text-3xl md:text-6xl text-white mb-6">
          Colecciones
        </h1>
        <p className="text-white/50 max-w-2xl mx-auto">
          Explora nuestra colección de obras surrealistas.
        </p>
      </section>

      <div className="pb-20">
        {!loading &&
          categorias.map((categoria) => {
            const obrasCategoria = obras.filter(
              (obra) => obra.categoria === categoria.id
            );

            if (obrasCategoria.length === 0) return null;

            // 🔑 Si hay 1 sola serie, mostrar sus imágenes
            // Si hay varias, mostrar 1 por serie (hasta 6)
            let obrasAMostrar;
            let expandirImagenes = false;

            if (obrasCategoria.length === 1) {
              // 1 sola serie: mostrar todas sus imágenes
              obrasAMostrar = obrasCategoria;
              expandirImagenes = true;
            } else {
              // Varias series: mostrar 1 imagen por serie
              obrasAMostrar = obrasCategoria.slice(0, 6);
              expandirImagenes = false;
            }

            return (
              <CategoryCarousel
                key={categoria.id}
                categoria={categoria}
                obras={obrasAMostrar}
                expandirImagenes={expandirImagenes}
              />
            );
          })}
      </div>
    </MainLayout>
  );
};

export default Colecciones;