const Categoria = require('../models/Categoria');
const Obra = require('../models/Obra');
const mongoose = require('mongoose');

const DEFAULT_CATEGORIAS = [
  {
    slug: 'gala-dali-dorado',
    nombre: 'Gala Dali Dorado',
    descripcion: 'Coleccion Gala Dali Dorado',
    orden: 10
  },
  {
    slug: 'fotos-textos',
    nombre: 'Libros',
    descripcion: 'Material grafico, textos y fotografias',
    orden: 20
  },
  {
    slug: 'litografias',
    nombre: 'Litografias',
    descripcion: 'Obra grafica y litografias originales',
    orden: 30
  },
  {
    slug: 'medallas-olimpicas',
    nombre: 'Medallas Olimpicas',
    descripcion: 'Medallas y piezas conmemorativas',
    orden: 40
  },
  {
    slug: 'vajilla',
    nombre: 'Vajilla',
    descripcion: 'Objetos utilitarios y piezas de diseno',
    orden: 50
  },
  {
    slug: 'esculturas',
    nombre: 'Esculturas',
    descripcion: 'Esculturas y piezas tridimensionales',
    orden: 60
  },
  {
    slug: 'gala-lincoln',
    nombre: 'Gala Lincoln',
    descripcion: 'Coleccion Gala Lincoln',
    orden: 70
  },
  {
    slug: 'muro-de-los-lamentos',
    nombre: 'Muro de los Lamentos',
    descripcion: 'Coleccion Muro de los Lamentos',
    orden: 80
  },
  {
    slug: 'obras-en-reserva',
    nombre: 'Obras en Reserva',
    descripcion: 'Coleccion de obras disponibles bajo consulta',
    orden: 90
  },
  {
    slug: 'botellas',
    nombre: 'Botellas',
    descripcion: 'Botellas y piezas unicas',
    orden: 100
  },
  {
    slug: 'coleccion-privada',
    nombre: 'Coleccion Privada',
    descripcion: 'Coleccion privada',
    path: '/coleccion-privada',
    orden: 1000,
    visible: false,
    privada: true
  }
];

const normalizeSlug = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const humanizeSlug = (slug = '') =>
  slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const normalizeImages = (imagenes) =>
  Array.isArray(imagenes) ? imagenes.filter(Boolean) : [];

const ensureDefaultCategorias = async () => {
  await Promise.all(DEFAULT_CATEGORIAS.map((categoria) => {
    const path = categoria.path || `/categoria/${categoria.slug}`;
    return Categoria.updateOne(
      { slug: categoria.slug },
      { $setOnInsert: { ...categoria, path } },
      { upsert: true }
    );
  }));

  const categoriasEnObras = await Obra.distinct('categoria');
  await Promise.all(categoriasEnObras.map((rawSlug, index) => {
    const slug = normalizeSlug(rawSlug);
    if (!slug) return null;

    return Categoria.updateOne(
      { slug },
      {
        $setOnInsert: {
          slug,
          nombre: humanizeSlug(slug),
          descripcion: '',
          path: `/categoria/${slug}`,
          orden: 2000 + index
        }
      },
      { upsert: true }
    );
  }).filter(Boolean));
};

const buildCategoriaPayload = (body, current = {}) => {
  const nombre = body.nombre?.trim();
  const slug = normalizeSlug(body.slug || nombre || current.nombre);
  const imagenes = body.imagenes !== undefined
    ? normalizeImages(body.imagenes)
    : current.imagenes;

  return {
    slug,
    nombre: nombre ?? current.nombre,
    descripcion: body.descripcion ?? current.descripcion ?? '',
    path: body.path || (slug ? `/categoria/${slug}` : current.path),
    imagenPrincipal: body.imagenPrincipal || imagenes?.[0] || current.imagenPrincipal || '',
    imagenes,
    orden: body.orden ?? current.orden ?? 999,
    visible: body.visible ?? current.visible ?? true,
    privada: body.privada ?? current.privada ?? false,
    updatedAt: Date.now()
  };
};

exports.getCategorias = async (req, res, next) => {
  try {
    await ensureDefaultCategorias();

    const admin = req.query.admin === 'true';
    const query = admin ? {} : { visible: true, privada: false };
    const categorias = await Categoria.find(query).sort({ orden: 1, nombre: 1 });

    res.json(categorias);
  } catch (error) {
    next(error);
  }
};

exports.getCategoriaBySlug = async (req, res, next) => {
  try {
    await ensureDefaultCategorias();

    const categoria = await Categoria.findOne({ slug: req.params.slug });
    if (!categoria) {
      return res.status(404).json({ error: 'Categoria no encontrada' });
    }

    res.json(categoria);
  } catch (error) {
    next(error);
  }
};

exports.createCategoria = async (req, res, next) => {
  try {
    const payload = buildCategoriaPayload(req.body);

    if (!payload.nombre) {
      return res.status(400).json({ error: 'El nombre de la categoria es requerido' });
    }

    if (!payload.slug) {
      return res.status(400).json({ error: 'No se pudo generar un slug valido' });
    }

    const existente = await Categoria.findOne({ slug: payload.slug });
    if (existente) {
      return res.status(400).json({ error: 'Ya existe una categoria con ese slug' });
    }

    const categoria = new Categoria(payload);
    await categoria.save();

    res.status(201).json(categoria);
  } catch (error) {
    next(error);
  }
};

exports.updateCategoria = async (req, res, next) => {
  try {
    const current = await Categoria.findById(req.params.id);
    if (!current) {
      return res.status(404).json({ error: 'Categoria no encontrada' });
    }

    const payload = buildCategoriaPayload(req.body, current);
    if (!payload.nombre) {
      return res.status(400).json({ error: 'El nombre de la categoria es requerido' });
    }

    const existente = await Categoria.findOne({
      slug: payload.slug,
      _id: { $ne: current._id }
    });
    if (existente) {
      return res.status(400).json({ error: 'Ya existe una categoria con ese slug' });
    }

    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    res.json(categoria);
  } catch (error) {
    next(error);
  }
};

exports.deleteCategoria = async (req, res, next) => {
  try {
    const lookup = mongoose.Types.ObjectId.isValid(req.params.id)
      ? { _id: req.params.id }
      : { slug: normalizeSlug(req.params.id) };

    const categoria = await Categoria.findOne(lookup);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoria no encontrada' });
    }

    const obras = await Obra.countDocuments({ categoria: categoria.slug });
    if (obras > 0) {
      return res.status(400).json({
        error: 'No se puede eliminar una categoria con obras asociadas'
      });
    }

    await categoria.deleteOne();
    res.json({ message: 'Categoria eliminada correctamente', categoria });
  } catch (error) {
    next(error);
  }
};
