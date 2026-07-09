const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    default: ''
  },
  path: {
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
  visible: {
    type: Boolean,
    default: true
  },
  privada: {
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

categoriaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (!this.path && this.slug) {
    this.path = `/categoria/${this.slug}`;
  }
  if (!this.imagenPrincipal && this.imagenes?.length) {
    this.imagenPrincipal = this.imagenes[0];
  }
  next();
});

module.exports = mongoose.model('Categoria', categoriaSchema);
