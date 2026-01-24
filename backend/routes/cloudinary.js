const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
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