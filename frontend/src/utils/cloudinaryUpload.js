const MB = 1024 * 1024;
const MAX_SOURCE_SIZE = 35 * MB;
const MAX_PAYLOAD_SIZE = 20 * MB;
const OPTIMIZE_THRESHOLD = 1.2 * MB;
const MAX_IMAGE_SIDE = 2400;
const JPEG_QUALITY = 0.88;

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
    reader.readAsDataURL(file);
  });

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo optimizar la imagen'));
    };
    image.src = url;
  });

const optimizeImage = async (file) => {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') {
    return fileToDataUrl(file);
  }

  if (file.size <= OPTIMIZE_THRESHOLD) {
    return fileToDataUrl(file);
  }

  try {
    const image = await loadImage(file);
    const maxSide = Math.max(image.naturalWidth, image.naturalHeight);
    const scale = Math.min(1, MAX_IMAGE_SIDE / maxSide);
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);

    const optimized = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
    const original = await fileToDataUrl(file);

    return optimized.length < original.length ? optimized : original;
  } catch (error) {
    console.warn('No se pudo optimizar la imagen antes de subirla:', error);
    return fileToDataUrl(file);
  }
};

export const uploadImageToCloudinary = async ({ file, folder, apiUrl }) => {
  if (!file) {
    throw new Error('La imagen es requerida');
  }

  if (!folder) {
    throw new Error('Primero seleccioná una categoría');
  }

  if (file.size > MAX_SOURCE_SIZE) {
    throw new Error('La imagen es demasiado grande. Probá con una menor a 35 MB.');
  }

  const dataUrl = await optimizeImage(file);
  if (dataUrl.length > MAX_PAYLOAD_SIZE) {
    throw new Error('La imagen sigue siendo demasiado grande después de optimizarla.');
  }

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
