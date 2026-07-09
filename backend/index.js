const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const obrasRoutes = require('./routes/obras');
const errorHandler = require('./middleware/errorHandler');
const cloudinaryRoutes = require('./routes/cloudinary');
const accesosRoutes = require('./routes/accesos');
const categoriasRoutes = require('./routes/categorias');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// Rutas
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend funcionando' });
});

app.use('/api/obras', obrasRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/accesos', accesosRoutes);

// Error handler
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
