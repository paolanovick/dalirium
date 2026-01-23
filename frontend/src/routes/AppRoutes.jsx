import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Colecciones from "../pages/Colecciones";
import CategoriaDetalle from "../pages/CategoriaDetalle";
import ObraDetalle from "../pages/ObraDetalle";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ObraForm from "../pages/admin/ObraForm";
import ColeccionPrivada from "../pages/ColeccionPrivada";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/colecciones" element={<Colecciones />} />
      <Route path="/categoria/:categoriaId" element={<CategoriaDetalle />} />
      <Route path="/obra/:slug" element={<ObraDetalle />} />
      <Route path="/coleccion-privada" element={<ColeccionPrivada />} />
      
      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/nueva" element={<ObraForm />} />
      <Route path="/admin/editar/:id" element={<ObraForm />} />
      
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;