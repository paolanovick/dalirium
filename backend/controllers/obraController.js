const Obra = require('../models/Obra');

// GET todas las obras
exports.getObras = async (req, res, next) => {
  try {
    const { categoria, ordenar } = req.query;

    // 🔒 ocultar privadas por defecto
    let query = { categoria: { $ne: 'coleccion-privada' } };

    // si piden una categoría específica
    if (categoria) {
      query.categoria = categoria;
    }

    let obras = await Obra.find(query);

    if (ordenar === 'asc') {
      obras.sort((a, b) => a.orden - b.orden);
    } else {
      obras.sort((a, b) => b.orden - a.orden);
    }

    res.json(obras);
  } catch (error) {
    next(error);
  }
};


// GET obra por slug
exports.getObraBySlug = async (req, res, next) => {
  try {
    const obra = await Obra.findOne({ slug: req.params.slug });
    if (!obra) {
      return res.status(404).json({ error: 'Obra no encontrada' });
    }
    res.json(obra);
  } catch (error) {
    next(error);
  }
};

// GET obra por ID
exports.getObraById = async (req, res, next) => {
  try {
    const obra = await Obra.findById(req.params.id);
    if (!obra) {
      return res.status(404).json({ error: 'Obra no encontrada' });
    }
    res.json(obra);
  } catch (error) {
    next(error);
  }
};

// POST crear nueva obra
exports.createObra = async (req, res, next) => {
  try {
    const { slug, titulo, categoria, subcategoria, imagenPrincipal, imagenes } = req.body;
    
    if (!slug || !titulo || !categoria || !subcategoria || !imagenPrincipal) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    const obraExistente = await Obra.findOne({ slug });
    if (obraExistente) {
      return res.status(400).json({ error: 'El slug ya existe' });
    }
    
    const obra = new Obra({
      slug,
      titulo,
      categoria,
      subcategoria,
      imagenPrincipal,
      imagenes: imagenes || [imagenPrincipal]
    });
    
    await obra.save();
    res.status(201).json(obra);
  } catch (error) {
    next(error);
  }
};

// PUT actualizar obra
exports.updateObra = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const obra = await Obra.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!obra) {
      return res.status(404).json({ error: 'Obra no encontrada' });
    }
    
    res.json(obra);
  } catch (error) {
    next(error);
  }
};

// DELETE obra
exports.deleteObra = async (req, res, next) => {
  try {
    const obra = await Obra.findByIdAndDelete(req.params.id);
    
    if (!obra) {
      return res.status(404).json({ error: 'Obra no encontrada' });
    }
    
    res.json({ message: 'Obra eliminada correctamente', obra });
  } catch (error) {
    next(error);
  }
};