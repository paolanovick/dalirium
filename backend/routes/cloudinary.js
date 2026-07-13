const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const normalizeFolder = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// POST subir imagen firmada desde el backend
router.post('/upload', async (req, res) => {
  try {
    const { file, folder, filename } = req.body;
    const folderSlug = normalizeFolder(folder);

    if (!file) {
      return res.status(400).json({ error: 'La imagen es requerida' });
    }

    if (!folderSlug) {
      return res.status(400).json({ error: 'La carpeta es requerida' });
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: `dalirium/${folderSlug}`,
      resource_type: 'image',
      use_filename: true,
      unique_filename: true,
      filename_override: filename
    });

    res.status(201).json({
      public_id: result.public_id,
      url: result.secure_url,
      secure_url: result.secure_url,
      thumbnail: cloudinary.url(result.public_id, {
        width: 150,
        height: 150,
        crop: 'fill'
      })
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET imágenes de una carpeta
router.get('/:carpeta', async (req, res) => {
  try {
    const { carpeta } = req.params;

    const result = await cloudinary.search
      .expression(`folder:dalirium/${carpeta}/*`)
      .sort_by('public_id', 'asc')
      .max_results(500)
      .execute();

    const imagenes = result.resources.map(img => ({
      public_id: img.public_id,
      url: img.secure_url,
      thumbnail: cloudinary.url(img.public_id, {
        width: 150,
        height: 150,
        crop: 'fill'
      })
    }));

    res.json(imagenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
