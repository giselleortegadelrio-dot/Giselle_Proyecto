import express from 'express';
import Evento from '../models/evento.js';
import Recinto from '../models/recinto.js';

const router = express.Router();

// GET /eventos - Obtener todos los eventos (con la información de su recinto)
router.get('/', async (req, res) => {
  try {
    const eventos = await Evento.find().populate('recinto');
    if (eventos.length === 0) {
      return res.status(500).json({ ok: false, error: 'No se han encontrado eventos' });
    }
    res.status(200).json({ ok: true, resultado: eventos });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'No se han encontrado eventos' });
  }
});

// GET /eventos/localidad/:nombre - Eventos de una localidad que aún no han pasado
router.get('/localidad/:nombre', async (req, res) => {
  try {
    // La localidad está en el recinto, así que primero buscamos los recintos de esa localidad
    const recintos = await Recinto.find({ localidad: req.params.nombre });
    const idsRecintos = recintos.map((recinto) => recinto._id);

    // Y después los eventos de esos recintos cuya fecha sea hoy o posterior
    const eventos = await Evento.find({
      recinto: { $in: idsRecintos },
      fecha: { $gte: new Date() }
    }).populate('recinto');

    if (eventos.length === 0) {
      return res.status(404).json({ ok: false, error: 'No se han encontrado eventos' });
    }
    res.status(200).json({ ok: true, resultado: eventos });
  } catch (error) {
    res.status(404).json({ ok: false, error: 'No se han encontrado eventos' });
  }
});

// GET /eventos/:id - Obtener un evento por su ID
router.get('/:id', async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id).populate('recinto');
    if (!evento) {
      return res.status(404).json({ ok: false, error: `Evento ${req.params.id} no encontrado` });
    }
    res.status(200).json({ ok: true, resultado: evento });
  } catch (error) {
    res.status(404).json({ ok: false, error: `Evento ${req.params.id} no encontrado` });
  }
});


router.get('/entradas/:idEvento/:tipoEntrada', async (req, res) => {
    try {
        const { idEvento, tipoEntrada } = req.params;

        const evento = await Evento.findById(idEvento);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                error: `Error obteniendo datos de entrada para evento ${idEvento}`
            });
        }

        const entrada = evento.entradas.find(
            entrada => entrada.tipo === tipoEntrada
        );

        if (!entrada) {
            return res.status(404).json({
                ok: false,
                error: `Error obteniendo datos de entrada para evento ${idEvento}`
            });
        }

        res.status(200).json({
            ok: true,
            resultado: {
                precio: entrada.precio,
                disponibles: entrada.disponibles
            }
        });

    } catch (error) {
        res.status(404).json({
            ok: false,
            error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`
        });
    }
});


// POST /eventos - Añadir un nuevo evento
router.post('/', async (req, res) => {
  try {
    const nuevoEvento = new Evento({
      nombre: req.body.nombre,
      fecha: req.body.fecha,
      entradas: req.body.entradas,
      recinto: req.body.recinto
    });
    const eventoGuardado = await nuevoEvento.save();
    res.status(201).json({ ok: true, resultado: eventoGuardado });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Error añadiendo evento' });
  }
});

// PUT /eventos/:id - Actualizar un evento por su ID
router.put('/:id', async (req, res) => {
  try {
    const eventoActualizado = await Evento.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        fecha: req.body.fecha,
        entradas: req.body.entradas,
        recinto: req.body.recinto
      },
      { new: true, runValidators: true }
    );
    if (!eventoActualizado) {
      return res.status(404).json({ ok: false, error: `Error actualizando evento ${req.params.id}` });
    }
    res.status(200).json({ ok: true, resultado: eventoActualizado });
  } catch (error) {
    res.status(404).json({ ok: false, error: `Error actualizando evento ${req.params.id}` });
  }
});

// DELETE /eventos/:id - Eliminar un evento por su ID
router.delete('/:id', async (req, res) => {
  try {
    const eventoEliminado = await Evento.findByIdAndDelete(req.params.id);
    if (!eventoEliminado) {
      return res.status(404).json({ ok: false, error: `Error eliminando evento ${req.params.id}` });
    }
    res.status(200).json({ ok: true, resultado: eventoEliminado });
  } catch (error) {
    res.status(404).json({ ok: false, error: `Error eliminando evento ${req.params.id}` });
  }
});


router.put('/entradas/:idEvento/:tipoEntrada/:cantidad', async (req, res) => {
    try {
        const { idEvento, tipoEntrada, cantidad } = req.params;

        // Convertimos la cantidad recibida en la URL a número
        const cantidadNumerica = Number(cantidad);

        // Comprobamos que sea un entero positivo
        if (!Number.isInteger(cantidadNumerica) || cantidadNumerica <= 0) {
            return res.status(404).json({
                ok: false,
                error: `Error actualizando entradas del evento ${idEvento}`
            });
        }

        // Buscamos el evento por su ID
        const evento = await Evento.findById(idEvento);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                error: `Error actualizando entradas del evento ${idEvento}`
            });
        }

        // Buscamos el tipo de entrada dentro del evento
        const entrada = evento.entradas.find(
            entrada => entrada.tipo === tipoEntrada
        );

        // Comprobamos que exista y que haya suficientes entradas
        if (!entrada || entrada.disponibles < cantidadNumerica) {
            return res.status(404).json({
                ok: false,
                error: `Error actualizando entradas del evento ${idEvento}`
            });
        }

        // Restamos las entradas disponibles
        entrada.disponibles -= cantidadNumerica;

        // Guardamos los cambios en MongoDB
        await evento.save();

        // Devolvemos el evento actualizado
        res.status(200).json({
            ok: true,
            resultado: evento
        });

    } catch (error) {
        res.status(404).json({
            ok: false,
            error: `Error actualizando entradas del evento ${req.params.idEvento}`
        });
    }
});


export default router;