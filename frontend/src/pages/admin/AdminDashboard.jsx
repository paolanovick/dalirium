import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const CATEGORIAS = [
  'botellas',
  'gala-dali-dorado',
  'fotos-textos',
  'litografias',
  'medallas-olimpicas',
  'vajilla',
  'esculturas',
  'gala-lincoln',
  'muro-de-los-lamentos',
  'coleccion-privada'
];

const AdminDashboard = () => {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState('botellas');
  const [codigoActual, setCodigoActual] = useState('');
  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [savingCodigo, setSavingCodigo] = useState(false);
  const [mensajeCodigo, setMensajeCodigo] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkField, setBulkField] = useState('categoria');
  const [bulkValue, setBulkValue] = useState('');
  const [bulkSaving, setBulkSaving] = useState(false);

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
      setSelectedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === obrasFiltradas.length && obrasFiltradas.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(obrasFiltradas.map(o => o._id)));
    }
  };

  const handleBulkApply = async () => {
    if (!bulkValue || selectedIds.size === 0) return;
    setBulkSaving(true);
    try {
      await Promise.all([...selectedIds].map(id => {
        const obra = obras.find(o => o._id === id);
        const valor = bulkValue === 'true' ? true : bulkValue === 'false' ? false : bulkValue;
        return fetch(`${API_URL}/api/obras/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...obra, [bulkField]: valor })
        });
      }));
      const valor = bulkValue === 'true' ? true : bulkValue === 'false' ? false : bulkValue;
      setObras(prev => prev.map(o => selectedIds.has(o._id) ? { ...o, [bulkField]: valor } : o));
      setSelectedIds(new Set());
      setBulkValue('');
    } catch (error) {
      console.error('Error al aplicar cambios masivos:', error);
    } finally {
      setBulkSaving(false);
    }
  };

  const obrasFiltradas = obras.filter(obra => obra.categoria === categoriaActiva);
  const allSelected = obrasFiltradas.length > 0 && selectedIds.size === obrasFiltradas.length;

  if (loading) {
    return <div className="p-8 text-white">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">🎨 Admin Dalirium</h1>
          <div className="flex flex-wrap items-end gap-4">
            <div className="bg-gray-800 rounded-lg px-4 py-3 flex flex-wrap items-end gap-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Código privada: <span className="text-amber-400 font-mono font-bold">{codigoActual || '...'}</span>
                </p>
                <form onSubmit={handleCambiarCodigo} className="flex gap-2">
                  <input
                    type="text"
                    value={nuevoCodigo}
                    onChange={(e) => setNuevoCodigo(e.target.value.toUpperCase())}
                    placeholder="Nuevo código"
                    minLength={4}
                    required
                    className="p-2 bg-gray-700 border border-gray-600 rounded text-white font-mono uppercase text-sm focus:border-amber-500 outline-none w-36"
                  />
                  <button
                    type="submit"
                    disabled={savingCodigo}
                    className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 px-3 py-2 rounded text-sm font-bold"
                  >
                    {savingCodigo ? '...' : 'Cambiar'}
                  </button>
                </form>
                {mensajeCodigo && <p className="text-xs mt-1">{mensajeCodigo}</p>}
              </div>
            </div>
            <Link to="/admin/nueva" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
              + Nueva Obra
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              onClick={() => { setCategoriaActiva(cat); setSelectedIds(new Set()); }}
              className={`px-4 py-2 rounded text-sm ${categoriaActiva === cat ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Barra de edición masiva */}
        {selectedIds.size > 0 && (
          <div className="bg-blue-900 border border-blue-600 rounded-lg p-4 mb-4 flex flex-wrap items-center gap-4">
            <span className="text-blue-300 font-semibold">{selectedIds.size} obra{selectedIds.size > 1 ? 's' : ''} seleccionada{selectedIds.size > 1 ? 's' : ''}</span>
            <select
              value={bulkField}
              onChange={e => { setBulkField(e.target.value); setBulkValue(''); }}
              className="p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm outline-none"
            >
              <option value="categoria">Cambiar categoría</option>
              <option value="titulo">Cambiar título</option>
              <option value="precio">Cambiar precio</option>
              <option value="destacada">Cambiar destacada</option>
            </select>
            {bulkField === 'categoria' && (
              <select
                value={bulkValue}
                onChange={e => setBulkValue(e.target.value)}
                className="p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm outline-none"
              >
                <option value="">-- Elegir --</option>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
            {bulkField === 'titulo' && (
              <input
                type="text"
                value={bulkValue}
                onChange={e => setBulkValue(e.target.value)}
                placeholder="Nuevo título"
                className="p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm outline-none w-48"
              />
            )}
            {bulkField === 'precio' && (
              <input
                type="text"
                value={bulkValue}
                onChange={e => setBulkValue(e.target.value)}
                placeholder="Ej: Consultar"
                className="p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm outline-none w-36"
              />
            )}
            {bulkField === 'destacada' && (
              <select
                value={bulkValue}
                onChange={e => setBulkValue(e.target.value)}
                className="p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm outline-none"
              >
                <option value="">-- Elegir --</option>
                <option value="true">Sí (destacada)</option>
                <option value="false">No</option>
              </select>
            )}
            <button
              onClick={handleBulkApply}
              disabled={bulkSaving || !bulkValue}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded text-sm font-bold"
            >
              {bulkSaving ? 'Aplicando...' : 'Aplicar'}
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-gray-400 hover:text-white text-sm"
            >
              Deseleccionar todo
            </button>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="p-3 text-left">Imagen</th>
                <th className="p-3 text-left">Título</th>
                <th className="p-3 text-left">Categoría</th>
                <th className="p-3 text-left">Imágenes</th>
                <th className="p-3 text-left">Orden</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {obrasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400">
                    No hay obras en esta categoría.
                  </td>
                </tr>
              ) : (
                obrasFiltradas.map(obra => (
                  <tr
                    key={obra._id}
                    className={`border-t border-gray-700 hover:bg-gray-750 ${selectedIds.has(obra._id) ? 'bg-blue-900/20' : ''}`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(obra._id)}
                        onChange={() => toggleSelect(obra._id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="p-3">
                      <img
                        src={obra.imagenPrincipal.startsWith('http')
                          ? obra.imagenPrincipal.replace('/upload/', '/upload/w_80,h_80,c_fill/')
                          : `https://res.cloudinary.com/dwz6kggqe/image/upload/w_80,h_80,c_fill/${obra.imagenPrincipal}`}
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
                    <td className="p-3">{obra.imagenes?.length || 0}</td>
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