import express from 'express';
import Contacto from '../models/contacto.js';

const router = express.Router();

// GET /contactos - Obtener todos los contactos
router.get('/', async (req, res) => {
  try {
    const contactos = await Contacto.find();
    res.status(200).json(contactos);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error al obtener los contactos' });
  }
});

// GET /contactos/:id - Obtener un contacto por su ID
router.get('/:id', async (req, res) => {
  try {
    const contacto = await Contacto.findById(req.params.id);
    if (!contacto) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }
    res.status(200).json(contacto);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID no válido' });
    }
    res.status(500).json({ message: error.message || 'Error al obtener el contacto' });
  }
});

// POST /contactos - Crear un nuevo contacto
router.post('/', async (req, res) => {
  try {
    const nuevoContacto = new Contacto({
      nombre: req.body.nombre,
      edad: req.body.edad,
      telefono: req.body.telefono
    });
    const contactoGuardado = await nuevoContacto.save();
    res.status(201).json(contactoGuardado);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || 'Error al crear el contacto' });
  }
});

// PUT /contactos/:id - Actualizar un contacto existente por ID
router.put('/:id', async (req, res) => {
  try {
    const contactoActualizado = await Contacto.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        edad: req.body.edad,
        telefono: req.body.telefono
      },
      { new: true, runValidators: true }
    );

    if (!contactoActualizado) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    res.status(200).json(contactoActualizado);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || 'Error al actualizar el contacto' });
  }
});

// DELETE /contactos/:id - Eliminar un contacto por ID
router.delete('/:id', async (req, res) => {
  try {
    const contactoEliminado = await Contacto.findByIdAndDelete(req.params.id);
    if (!contactoEliminado) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }
    res.status(200).json({ message: 'Contacto eliminado correctamente' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID no válido' });
    }
    res.status(500).json({ message: error.message || 'Error al eliminar el contacto' });
  }
});

export default router;

