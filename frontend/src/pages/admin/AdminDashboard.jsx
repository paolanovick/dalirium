import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const CATEGORIAS = [
  'cuadros',
  'medallas-olimpicas',
  'litografias',
  'cuadros-chicos',
  'vajilla',
  'fotos-textos',
  'coleccion-privada'
];

const AdminDashboard = () => {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState('cuadros');
  const [codigoActual, setCodigoActual] = useState('');
  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [savingCodigo, setSavingCodigo] = useState(false);
  const [mensajeCodigo, setMensajeCodigo] = useState('');

  useEffect(() => {
    fetchObras();
    fetchCodigo();
  }, []);

  const fetchCodigo = async () => {
    try {
      const res = await fetch(`${API_URL}/api/accesos/config`);
      const data = await res.json();
      setCodigoActual(data.codigoAcceso);
    } catch (error) {
      console.error('Error al cargar código:', error);
    }
  };

  const handleCambiarCodigo = async (e) => {
    e.preventDefault();
    if (!nuevoCodigo.trim()) return;
    setSavingCodigo(true);
    setMensajeCodigo('');
    try {
      const res = await fetch(`${API_URL}/api/accesos/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigoAcceso: nuevoCodigo.toUpperCase() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCodigoActual(data.codigoAcceso);
      setNuevoCodigo('');
      setMensajeCodigo('✅ Código actualizado correctamente');
      setTimeout(() => setMensajeCodigo(''), 3000);
    } catch (error) {
      setMensajeCodigo('❌ ' + error.message);
    } finally {
      setSavingCodigo(false);
    }
  };

  const fetchObras = async () => {
    try {
      const res = await fetch(`${API_URL}/api/obras`);
      const data = await res.json();
      setObras(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteObra = async (id) => {
    if (!confirm('¿Eliminar esta obra?')) return;
    
    try {
      await fetch(`${API_URL}/api/obras/${id}`, { method: 'DELETE' });
      setObras(obras.filter(o => o._id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };
const obrasFiltradas = obras.filter(
  obra => obra.categoria === categoriaActiva
);

if (loading) {
  return <div className="p-8 text-white">Cargando...</div>;
}

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🎨 Admin Dalirium</h1>
          <Link 
            to="/admin/nueva" 
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            + Nueva Obra
          </Link>
        </div>
<div className="flex flex-wrap gap-2 mb-6">
  {CATEGORIAS.map(cat => (
    <button
      key={cat}
      onClick={() => setCategoriaActiva(cat)}
      className={`px-4 py-2 rounded text-sm ${
        categoriaActiva === cat
          ? 'bg-blue-600'
          : 'bg-gray-700 hover:bg-gray-600'
      }`}
    >
      {cat}
    </button>
  ))}
</div>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-3 text-left">Imagen</th>
                <th className="p-3 text-left">Título</th>
                <th className="p-3 text-left">Categoría</th>
                <th className="p-3 text-left">Imágenes</th>
                <th className="p-3 text-left">Orden</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {obras.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    No hay obras. ¡Creá la primera!
                  </td>
                </tr>
              ) : (
               obrasFiltradas.map(obra => (

                  <tr key={obra._id} className="border-t border-gray-700 hover:bg-gray-750">
                    <td className="p-3">
                      <img 
                       src={obra.imagenPrincipal.startsWith('http') 
  ? obra.imagenPrincipal.replace('/upload/', '/upload/w_80,h_80,c_fill/')
  : `https://res.cloudinary.com/dwz6kggqe/image/upload/w_80,h_80,c_fill/${obra.imagenPrincipal}`
}
                        alt={obra.titulo}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-3">
  <span className="flex items-center gap-2">
    {obra.titulo}

    {obra.categoria === 'coleccion-privada' && (
      <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded">
        🔒 Privada
      </span>
    )}
  </span>
</td>

                    <td className="p-3">{obra.categoria}</td>
                    <td className="p-3">
  {obra.imagenes?.length || 0}
</td>

                    <td className="p-3">{obra.orden}</td>
                    <td className="p-3 space-x-2">
                      <Link 
                        to={`/admin/editar/${obra._id}`}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                      >
                        Editar
                      </Link>
                      <button 
                        onClick={() => deleteObra(obra._id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* CÓDIGO DE ACCESO COLECCIÓN PRIVADA */}
        <div className="mt-10 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-1">🔒 Código de acceso — Colección Privada</h2>
          <p className="text-gray-400 text-sm mb-4">
            Código actual: <span className="text-amber-400 font-mono font-bold">{codigoActual || '...'}</span>
          </p>
          <form onSubmit={handleCambiarCodigo} className="flex gap-3 items-end">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nuevo código</label>
              <input
                type="text"
                value={nuevoCodigo}
                onChange={(e) => setNuevoCodigo(e.target.value.toUpperCase())}
                placeholder="Ej: DALI2026"
                minLength={4}
                required
                className="p-2 bg-gray-700 border border-gray-600 rounded text-white font-mono uppercase focus:border-amber-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={savingCodigo}
              className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 px-4 py-2 rounded font-bold"
            >
              {savingCodigo ? 'Guardando...' : 'Cambiar código'}
            </button>
          </form>
          {mensajeCodigo && (
            <p className="mt-3 text-sm">{mensajeCodigo}</p>
          )}
        </div>

        <div className="mt-4">
          <Link to="/" className="text-gray-400 hover:text-white">
            ← Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;