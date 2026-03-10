const mongoose = require('mongoose');

const obraSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  titulo: {
    type: String,
    default: 'Sin título'
  },
  categoria: {
    type: String,
    required: true,
    enum: ['botellas', 'gala-dali-dorado', 'fotos-textos', 'litografias', 'medallas-olimpicas', 'vajilla', 'esculturas', 'gala-lincoln', 'muro-de-los-lamentos', 'coleccion-privada']
  },
  subcategoria: {
    type: String,
    default: ''
  },
  imagenPrincipal: {
    type: String,
    default: ''
  },
  imagenes: [{
    type: String
  }],
  orden: {
    type: Number,
    default: 999
  },
  precio: {
    type: String,
    default: 'Consultar'
  },
  descripcion: {
    type: String,
    default: ''
  },
  tecnica: {
    type: String,
    default: ''
  },
  dimensiones: {
    type: String,
    default: ''
  },
  año: {
    type: String,
    default: ''
  },
  destacada: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Obra', obraSchema);