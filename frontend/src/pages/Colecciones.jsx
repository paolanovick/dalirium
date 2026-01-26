import MainLayout from "../components/layout/MainLayout";
import LazyCarousel from "../components/carousel/LazyCarousel";
import { categorias } from "../data/categorias";

const Colecciones = () => {
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
        {categorias.map((categoria) => (
          <LazyCarousel key={categoria.id} categoria={categoria} />
        ))}
      </div>
    </MainLayout>
  );
};

export default Colecciones;