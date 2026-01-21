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
    required: true
  },
  categoria: {
    type: String,
    required: true,
    enum: ['relojes', 'litografias', 'cuadros', 'cuadros-chicos', 'esculturas', 'medallas-olimpicas', 'juegos-olimpicos', 'vajilla', 'fotos-textos', 'daga', 'certificados', 'coleccion-privada']
  },
  subcategoria: {
    type: String,
    required: true
  },
  imagenPrincipal: {
    type: String,
    required: true
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