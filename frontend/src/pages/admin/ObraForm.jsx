import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORIAS = [
  'relojes', 'litografias', 'cuadros', 'cuadros-chicos', 
  'esculturas', 'medallas-olimpicas', 'juegos-olimpicos', 
  'vajilla', 'fotos-textos', 'daga', 'certificados', 'coleccion-privada'
];

const ObraForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    titulo: '',
    slug: '',
    categoria: 'relojes',
    subcategoria: '',
    imagenPrincipal: '',
    imagenes: [],
    orden: 999,
    precio: 'Consultar',
    descripcion: '',
    tecnica: '',
    dimensiones: '',
    año: '',
    destacada: false
  });

  const [cloudinaryImages, setCloudinaryImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Cargar obra si estamos editando
  useEffect(() => {
    if (isEditing) {
      fetch(`${API_URL}/api/obras/${id}`)
        .then(res => res.json())
        .then(data => setForm(data))
        .catch(err => console.error(err));
    }
  }, [id, isEditing]);

  // Cargar imágenes de Cloudinary cuando cambia la categoría
  useEffect(() => {
    if (form.categoria) {
      loadCloudinaryImages(form.categoria);
    }
  }, [form.categoria]);

  const loadCloudinaryImages = async (carpeta) => {
    setLoadingImages(true);
    try {
      const res = await fetch(`${API_URL}/api/cloudinary/${carpeta}`);
      const data = await res.json();
      setCloudinaryImages(data);
    } catch (error) {
      console.error('Error cargando imágenes:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  // Subir imagen a Cloudinary
 // Subir imagen directo a Cloudinary
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'dalirium_unsigned');
      formData.append('folder', `dalirium/${form.categoria}`);

      const res = await fetch('https://api.cloudinary.com/v1_1/dwz6kggqe/image/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Error al subir imagen');

      const data = await res.json();
      
      const newImage = {
        public_id: data.public_id,
        url: data.secure_url,
        thumbnail: data.secure_url.replace('/upload/', '/upload/w_150,h_150,c_fill/')
      };
      
      // Agregar la nueva imagen al inicio del listado
      setCloudinaryImages(prev => [newImage, ...prev]);
      
      // Seleccionar automáticamente la imagen subida
      setForm(prev => ({
        ...prev,
        imagenes: [...prev.imagenes, newImage.public_id],
        imagenPrincipal: prev.imagenPrincipal || newImage.public_id
      }));

      alert('✅ Imagen subida correctamente');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al subir la imagen');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generar slug desde título
    if (name === 'titulo') {
      const slug = value
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setForm(prev => ({ ...prev, slug }));
    }

    // Auto-setear subcategoria igual a categoria
    if (name === 'categoria') {
      setForm(prev => ({ ...prev, subcategoria: value }));
    }
  };

  const toggleImage = (public_id) => {
    setForm(prev => {
      const exists = prev.imagenes.includes(public_id);
      const newImagenes = exists 
        ? prev.imagenes.filter(img => img !== public_id)
        : [...prev.imagenes, public_id];
      
      // Si es la primera imagen, setearla como principal
      const newPrincipal = newImagenes.length > 0 && !newImagenes.includes(prev.imagenPrincipal)
        ? newImagenes[0]
        : prev.imagenPrincipal;

      return {
        ...prev,
        imagenes: newImagenes,
        imagenPrincipal: newImagenes.length === 1 ? newImagenes[0] : newPrincipal
      };
    });
  };

  const setPrincipal = (public_id) => {
    setForm(prev => ({ ...prev, imagenPrincipal: public_id }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEditing ? `${API_URL}/api/obras/${id}` : `${API_URL}/api/obras`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        navigate('/admin');
      } else {
        const error = await res.json();
        alert(error.error || 'Error al guardar');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {isEditing ? '✏️ Editar Obra' : '➕ Nueva Obra'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título y Slug */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Título *</label>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-2">Slug (auto)</label>
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

          {/* Categoría y Orden */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Categoría *</label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 outline-none"
              >
                {CATEGORIAS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
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

          {/* Selector de Imágenes de Cloudinary */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label>
                Imágenes de Cloudinary ({form.categoria})
                {loadingImages && <span className="ml-2 text-gray-400">Cargando...</span>}
              </label>
              
              {/* Botón subir imagen */}
              <label className={`cursor-pointer px-4 py-2 rounded text-sm ${
                uploading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}>
                {uploading ? '⏳ Subiendo...' : '📤 Subir imagen'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            
            <div className="bg-gray-800 p-4 rounded border border-gray-700 max-h-80 overflow-y-auto">
              {cloudinaryImages.length === 0 ? (
                <p className="text-gray-400">No hay imágenes en esta carpeta</p>
              ) : (
                <div className="grid grid-cols-6 gap-2">
                  {cloudinaryImages.map(img => {
                    const isSelected = form.imagenes.includes(img.public_id);
                    const isPrincipal = form.imagenPrincipal === img.public_id;
                    return (
                      <div 
                        key={img.public_id}
                        className={`relative cursor-pointer rounded overflow-hidden border-2 ${
                          isPrincipal ? 'border-yellow-500' : isSelected ? 'border-green-500' : 'border-transparent'
                        }`}
                        onClick={() => {
                          if (isSelected && !isPrincipal) {
                            setPrincipal(img.public_id);
                          } else {
                            toggleImage(img.public_id);
                          }
                        }}
                        title="Click: seleccionar | Click en seleccionada: hacer principal"
                      >
                        <img src={img.thumbnail} alt="" className="w-full h-20 object-cover" />
                        {isPrincipal && (
                          <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs px-1">★</div>
                        )}
                        {isSelected && !isPrincipal && (
                          <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-1">✓</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Click para seleccionar | Click en imagen seleccionada (verde) para hacerla principal (★)
            </p>
            <p className="text-sm text-gray-400">
              Seleccionadas: {form.imagenes.length} | Principal: {form.imagenPrincipal || 'ninguna'}
            </p>
          </div>

          {/* Campos opcionales */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Precio</label>
              <input
                type="text"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-2">Año</label>
              <input
                type="text"
                name="año"
                value={form.año}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Técnica</label>
              <input
                type="text"
                name="tecnica"
                value={form.tecnica}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-2">Dimensiones</label>
              <input
                type="text"
                name="dimensiones"
                value={form.dimensiones}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="destacada"
              checked={form.destacada}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label>Obra destacada</label>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving || !form.imagenPrincipal}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold"
            >
              {saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Obra'}
            </button>
            <Link
              to="/admin"
              className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ObraForm;