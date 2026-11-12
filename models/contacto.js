import mongoose from 'mongoose';

const contactoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  edad: {
    type: Number,
    required: true,
    min: 0
  },
  telefono: {
    type: String,
    required: true,
    trim: true
  }
});

const Contacto = mongoose.model('contactos', contactoSchema);

export default Contacto;

