const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Acceso = require('../models/Acceso');
const Config = require('../models/Config');

// Obtener o crear config inicial
async function getConfig() {
  let config = await Config.findOne();
  if (!config) {
    config = await Config.create({ 
      clave: 'admin',
      codigoAcceso: 'DALI2025' 
    });
  }
  return config;
}

// POST - Registrar acceso (visitante)
router.post('/registrar', async (req, res) => {
  try {
    const { email, nombre, codigoAcceso } = req.body;
    
    if (!email || !codigoAcceso) {
      return res.status(400).json({ error: 'Email y código son requeridos' });
    }

    const config = await getConfig();
    
    if (codigoAcceso !== config.codigoAcceso) {
      return res.status(401).json({ error: 'Código de acceso incorrecto' });
    }

    // Generar token único
    const token = crypto.randomBytes(32).toString('hex');
    
    // Expira en 30 minutos
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const acceso = await Acceso.create({
      email,
      nombre: nombre || '',
      token,
      expiresAt
    });

    res.json({ 
      token,
      expiresAt,
      message: 'Acceso concedido por 30 minutos'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Validar token
router.post('/validar', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ valid: false, error: 'Token requerido' });
    }

    const acceso = await Acceso.findOne({ token });
    
    if (!acceso) {
      return res.status(401).json({ valid: false, error: 'Token inválido' });
    }

    if (new Date() > acceso.expiresAt) {
      return res.status(401).json({ valid: false, error: 'Token expirado' });
    }

    res.json({ valid: true, expiresAt: acceso.expiresAt });
  } catch (error) {
    res.status(500).json({ valid: false, error: error.message });
  }
});

// GET - Listar accesos (admin)
router.get('/', async (req, res) => {
  try {
    const accesos = await Acceso.find()
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(accesos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener código actual (admin)
router.get('/config', async (req, res) => {
  try {
    const config = await getConfig();
    res.json({ codigoAcceso: config.codigoAcceso });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Cambiar código de acceso (admin)
router.put('/config', async (req, res) => {
  try {
    const { codigoAcceso } = req.body;
    
    if (!codigoAcceso || codigoAcceso.length < 4) {
      return res.status(400).json({ error: 'Código debe tener al menos 4 caracteres' });
    }

    const config = await getConfig();
    config.codigoAcceso = codigoAcceso;
    config.updatedAt = new Date();
    await config.save();

    res.json({ message: 'Código actualizado', codigoAcceso });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;