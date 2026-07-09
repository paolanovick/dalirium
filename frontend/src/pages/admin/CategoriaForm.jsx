import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearCategoriasCache } from '../../data/categorias';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.triptest.com.ar/dalirium';

const generateSlug = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const CategoriaForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    slug: '',
    descripcion: '',
    imagenPrincipal: '',
    imagenes: [],
    orden: 999,
    visible: true,
    privada: false
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'nombre') {
      setForm(prev => ({ ...prev, slug: generateSlug(value) }));
    }

    if (name === 'slug') {
      setForm(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const handleUploadImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const folderSlug = form.slug || generateSlug(form.nombre);
    if (!folderSlug) {
      alert('Primero escribí el nombre de la categoría.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const uploaded = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'dalirium_unsigned');
        formData.append('folder', `dalirium/${folderSlug}`);

        const res = await fetch('https://api.cloudinary.com/v1_1/dnkm8v6eb/image/upload', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) throw new Error('Error al subir una imagen');
        const data = await res.json();
        uploaded.push(data.secure_url);
      }

      setForm(prev => {
        const imagenes = [...prev.imagenes, ...uploaded];
        return {
          ...prev,
          slug: folderSlug,
          imagenes,
          imagenPrincipal: prev.imagenPrincipal || imagenes[0] || ''
        };
      });
    } catch (error) {
      console.error(error);
      alert('No se pudieron subir las imágenes.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (image) => {
    setForm(prev => {
      const imagenes = prev.imagenes.filter(img => img !== image);
      return {
        ...prev,
        imagenes,
        imagenPrincipal: prev.imagenPrincipal === image ? imagenes[0] || '' : prev.imagenPrincipal
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`${API_URL}/api/categorias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          slug: form.slug || generateSlug(form.nombre),
          orden: Number(form.orden) || 999
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar la categoría');

      clearCategoriasCache();
      navigate('/admin');
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">+ Nueva Categoría</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-2">Slug *</label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_160px] gap-4">
            <div>
              <label className="block mb-2">Descripción</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-2">Orden</label>
              <input
                type="number"
                name="orden"
                value={form.orden}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="bg-gray-800 rounded border border-gray-700 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="font-bold">Imágenes de la categoría</h2>
                <p className="text-sm text-gray-400">Se suben a Cloudinary en dalirium/{form.slug || 'slug-categoria'}.</p>
              </div>
              <label className={`cursor-pointer px-4 py-2 rounded text-sm ${
                uploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}>
                {uploading ? 'Subiendo...' : 'Subir imágenes'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploading}
                  onChange={handleUploadImages}
                  className="hidden"
                />
              </label>
            </div>

            {form.imagenes.length === 0 ? (
              <p className="text-gray-400">Todavía no hay imágenes cargadas.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {form.imagenes.map((image) => (
                  <div key={image} className="relative aspect-square rounded overflow-hidden border border-gray-700">
                    <img src={image} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(image)}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white text-xs px-1 rounded"
                      title="Eliminar imagen"
                    >
                      X
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, imagenPrincipal: image }))}
                      className={`absolute bottom-0 left-0 right-0 text-xs py-1 ${
                        form.imagenPrincipal === image
                          ? 'bg-yellow-500 text-black'
                          : 'bg-black/70 text-white hover:bg-black'
                      }`}
                    >
                      {form.imagenPrincipal === image ? 'Principal' : 'Hacer principal'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="visible"
                checked={form.visible}
                onChange={handleChange}
                className="w-5 h-5"
              />
              Visible en el sitio
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="privada"
                checked={form.privada}
                onChange={handleChange}
                className="w-5 h-5"
              />
              Categoría privada
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving || uploading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold"
            >
              {saving ? 'Guardando...' : 'Crear Categoría'}
            </button>
            <Link to="/admin" className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaForm;
