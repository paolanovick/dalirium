const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  clave: {
    type: String,
    required: true
  },
  codigoAcceso: {
    type: String,
    required: true,
    default: 'DALI2025'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Config', configSchema);