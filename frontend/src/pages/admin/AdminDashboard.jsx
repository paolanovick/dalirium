import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchObras();
  }, []);

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

  if (loading) return <div className="p-8 text-white">Cargando...</div>;

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

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-3 text-left">Imagen</th>
                <th className="p-3 text-left">Título</th>
                <th className="p-3 text-left">Categoría</th>
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
                obras.map(obra => (
                  <tr key={obra._id} className="border-t border-gray-700 hover:bg-gray-750">
                    <td className="p-3">
                      <img 
                        src={`https://res.cloudinary.com/dwz6kggqe/image/upload/w_80,h_80,c_fill/${obra.imagenPrincipal}`}
                        alt={obra.titulo}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-3">{obra.titulo}</td>
                    <td className="p-3">{obra.categoria}</td>
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