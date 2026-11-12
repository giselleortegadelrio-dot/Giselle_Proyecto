import express from 'express';
import Recinto from '../models/recinto.js';

const router = express.Router();

// GET /recintos - Obtener todos los recintos
router.get('/', async (req, res) => {
  try {
    const recintos = await Recinto.find();
    if (recintos.length === 0) {
      return res.status(500).json({ ok: false, error: 'No se han encontrado recintos' });
    }
    res.status(200).json({ ok: true, resultado: recintos });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'No se han encontrado recintos' });
  }
});

// GET /recintos/localidad/:nombre - Obtener los recintos de una localidad
router.get('/localidad/:nombre', async (req, res) => {
  try {
    const recintos = await Recinto.find({ localidad: req.params.nombre });
    if (recintos.length === 0) {
      return res.status(404).json({
        ok: false,
        error: 'No se han encontrado recintos de la localidad indicada'
      });
    }
    res.status(200).json({ ok: true, resultado: recintos });
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: 'No se han encontrado recintos de la localidad indicada'
    });
  }
});

// GET /recintos/:id - Obtener un recinto por su ID
router.get('/:id', async (req, res) => {
  try {
    const recinto = await Recinto.findById(req.params.id);
    if (!recinto) {
      return res.status(404).json({ ok: false, error: `Recinto ${req.params.id} no encontrado` });
    }
    res.status(200).json({ ok: true, resultado: recinto });
  } catch (error) {
    res.status(404).json({ ok: false, error: `Recinto ${req.params.id} no encontrado` });
  }
});

// POST /recintos - Añadir un nuevo recinto
router.post('/', async (req, res) => {
  try {
    const nuevoRecinto = new Recinto({
      nombre: req.body.nombre,
      direccion: req.body.direccion,
      localidad: req.body.localidad,
      aforoMaximo: req.body.aforoMaximo
    });
    const recintoGuardado = await nuevoRecinto.save();
    res.status(201).json({ ok: true, resultado: recintoGuardado });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Error añadiendo recinto' });
  }
});

// DELETE /recintos/:id - Eliminar un recinto por su ID
router.delete('/:id', async (req, res) => {
  try {
    const recintoEliminado = await Recinto.findByIdAndDelete(req.params.id);
    if (!recintoEliminado) {
      return res.status(404).json({ ok: false, error: `Error eliminando recinto ${req.params.id}` });
    }
    res.status(200).json({ ok: true, resultado: recintoEliminado });
  } catch (error) {
    res.status(404).json({ ok: false, error: `Error eliminando recinto ${req.params.id}` });
  }
});

export default router;