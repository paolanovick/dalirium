import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Colecciones from "../pages/Colecciones";
import CategoriaDetalle from "../pages/CategoriaDetalle";
import ObraDetalle from "../pages/ObraDetalle";

const AppRoutes = () => {
  return (
   <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/colecciones" element={<Colecciones />} />
  <Route path="/categoria/:categoriaId" element={<CategoriaDetalle />} />
  <Route path="/obra/:slug" element={<ObraDetalle />} />
  <Route path="*" element={<Home />} />
</Routes>
  );
};

export default AppRoutes;
