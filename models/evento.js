import mongoose from 'mongoose';

// Subdocumento: entradas a la venta para un evento
const entradaSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  disponibles: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: 'El número de entradas disponibles debe ser un entero'
    }
  }
});

const eventoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    minlength: 5
  },
  fecha: {
    type: Date,
    required: true
  },
  entradas: [entradaSchema],
  recinto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'recintos',
    required: true
  }
});

const Evento = mongoose.model('eventos', eventoSchema);

export default Evento;
