const MAX_UPLOAD_SIZE = 18 * 1024 * 1024;

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
    reader.readAsDataURL(file);
  });

export const uploadImageToCloudinary = async ({ file, folder, apiUrl }) => {
  if (!file) {
    throw new Error('La imagen es requerida');
  }

  if (!folder) {
    throw new Error('Primero seleccioná una categoría');
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error('La imagen es demasiado grande. Probá con una menor a 18 MB.');
  }

  const dataUrl = await fileToDataUrl(file);
  const res = await fetch(`${apiUrl}/api/cloudinary/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      file: dataUrl,
      folder,
      filename: file.name
    })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Error al subir imagen');
  }

  const url = data.url || data.secure_url;
  return {
    public_id: data.public_id,
    url,
    thumbnail: data.thumbnail || url?.replace('/upload/', '/upload/w_150,h_150,c_fill/')
  };
};
